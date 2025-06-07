"""
pip install selenium webdriver-manager beautifulsoup4 lxml
export LINKEDIN_COOKIE=<tu li_at>
"""

from __future__ import annotations

import os, time, random, json, re, traceback
from pathlib import Path
from functools import wraps

from django.conf import settings                  # ← asegura DJANGO_SETTINGS_MODULE
from selenium import webdriver
from selenium.webdriver.chrome.service import Service as ChromeService
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
from bs4 import BeautifulSoup


# ───────────────────────────────────────────────────────────
#  Rutas ancladas en BASE_DIR
# ───────────────────────────────────────────────────────────
BASE_DIR = Path(settings.BASE_DIR) if hasattr(settings, "BASE_DIR") else Path(__file__).resolve().parent
RAW_PATH = BASE_DIR / "perfil_completo.json"
CLEAN_PATH = BASE_DIR / "perfil_limpio.json"


def take_information(url: str):
    """
    Scrapea un perfil de LinkedIn y genera un dict limpio.
    Además escribe los archivos JSON en BASE_DIR por compatibilidad.
    """
    # ---------- CONFIGURACIÓN ----------
    PROFILE_URL = url
    LI_AT = os.getenv("LINKEDIN_COOKIE")
    JSID = os.getenv("JSID_COOKIE")
    SCROLL_TIME = 30
    PAUSE_RANGE = (0.8, 1.8)
    # ------------------------------------

    if not LI_AT or len(LI_AT) < 50:
        raise ValueError("LINKEDIN_COOKIE vacío o demasiado corto")

    # ── Helpers cortos ─────────────────────────────────────
    def human():
        time.sleep(random.uniform(*PAUSE_RANGE))

    def wait_for(locator: str, by: By = By.CSS_SELECTOR, timeout: int = 15, clickable: bool = True):
        el = WebDriverWait(driver, timeout).until(EC.presence_of_element_located((by, locator)))
        driver.execute_script("arguments[0].scrollIntoView({block:'center'});", el)
        if clickable:
            WebDriverWait(driver, timeout).until(EC.element_to_be_clickable((by, locator)))
        return el

    def safe(step):
        def decorator(fn):
            @wraps(fn)
            def wrapper(*args, **kwargs):
                try:
                    return fn(*args, **kwargs)
                except Exception as e:  # noqa: BLE001
                    print(f"❌  Error en «{step}»: {e}")
                    traceback.print_exc()
            return wrapper
        return decorator

    # ── Chrome “menos detectable” ──────────────────────────
    opts = webdriver.ChromeOptions()
    opts.add_argument("--disable-blink-features=AutomationControlled")
    opts.add_argument("--disable-gpu")
    opts.add_argument("--start-maximized")
    opts.add_experimental_option("excludeSwitches", ["enable-automation"])

    driver = webdriver.Chrome(service=ChromeService(ChromeDriverManager().install()), options=opts)

    perfil: dict[str, str] = {}

    try:
        # 1) Sesión ---------------------------------------------------------------
        driver.get("https://www.linkedin.com")
        driver.delete_all_cookies()
        driver.add_cookie({"name": "li_at", "value": LI_AT, "domain": ".linkedin.com", "path": "/"})
        if JSID:
            driver.add_cookie({"name": "JSESSIONID", "value": JSID, "domain": ".linkedin.com", "path": "/"})
        driver.get(PROFILE_URL)
        wait_for("body", By.TAG_NAME, clickable=False)

        # 2) Información de contacto ---------------------------------------------
        @safe("Información de contacto")
        def contacto():
            wait_for("#top-card-text-details-contact-info").click()
            wait_for("div.artdeco-modal__content", clickable=False)
            human()
            perfil["contacto_html"] = driver.page_source
            driver.find_element(By.CSS_SELECTOR, "button.artdeco-modal__dismiss").click()

        # 3) Acerca de ------------------------------------------------------------
        @safe("Acerca de")
        def acerca():
            try:
                btn = wait_for(
                    "//section[contains(@class,'about')]//button"
                    "[contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),'ver más')]",
                    By.XPATH,
                    timeout=6,
                )
                btn.click()
                human()
            except TimeoutException:
                pass
            sec = driver.execute_script(
                """return document.evaluate("//section[contains(@class,'about')]",
                   document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;"""
            )
            perfil["acerca_html"] = sec.get_attribute("outerHTML") if sec else "<!-- no about -->"

        # 4) Publicaciones --------------------------------------------------------
        @safe("Publicaciones")
        def publicaciones():
            try:
                driver.get(PROFILE_URL + "recent-activity/posts/")
                WebDriverWait(driver, 5).until(EC.presence_of_element_located((By.TAG_NAME, "body")))
            except TimeoutException:
                driver.back()
                wait_for("//a[contains(@href,'recent-activity')]", By.XPATH).click()

            end = time.time() + SCROLL_TIME
            while time.time() < end:
                driver.execute_script("window.scrollBy(0, window.innerHeight);")
                human()
            perfil["publicaciones_html"] = driver.page_source
            driver.back()

        # 5) Aptitudes ------------------------------------------------------------
        @safe("Aptitudes")
        def aptitudes():
            wait_for("//section[@id='skills']", By.XPATH, clickable=False)
            btns = driver.find_elements(
                By.XPATH,
                "//section[@id='skills']//button[contains(translate(.,'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),'mostrar')]",
            )
            if btns:
                driver.execute_script("arguments[0].click();", btns[0])
                wait_for("div.artdeco-modal__content", clickable=False)
                perfil["aptitudes_html"] = driver.page_source
                driver.find_element(By.CSS_SELECTOR, "button.artdeco-modal__dismiss").click()
            else:
                perfil["aptitudes_html"] = driver.page_source

        # Ejecutar pasos
        contacto()
        acerca()
        publicaciones()
        aptitudes()

        perfil["perfil_html"] = driver.page_source

        # 6) Guardar RAW en BASE_DIR ---------------------------------------------
        RAW_PATH.write_text(json.dumps(perfil, ensure_ascii=False, indent=2), encoding="utf-8")
        print(f"✅ RAW escrito en {RAW_PATH.relative_to(BASE_DIR)}")

        # ── Limpieza en memoria (BeautifulSoup) ────────────────────────────────
        def html2text(html: str) -> str:
            soup = BeautifulSoup(html, "lxml")
            for t in soup(["script", "style"]):
                t.decompose()
            return " ".join(soup.stripped_strings)

        def get_profile_info(soup):
            return {
                "nombre": soup.select_one("h1").get_text(strip=True) if soup.select_one("h1") else "",
                "titular": soup.select_one("div.text-body-medium, h2").get_text(strip=True)
                if soup.select_one("div.text-body-medium, h2")
                else "",
                "ubicacion": soup.select_one("span.text-body-small").get_text(strip=True)
                if soup.select_one("span.text-body-small")
                else "",
            }

        def get_experiences(soup):
            exps = []
            for li in soup.select('section:has(h2:-soup-contains("Experiencia")) li'):
                exps.append(
                    {
                        "puesto": li.select_one("span[aria-hidden='true']").get_text(strip=True)
                        if li.select_one("span[aria-hidden='true']")
                        else "",
                        "empresa": li.select_one("span.t-14.t-normal").get_text(strip=True)
                        if li.select_one("span.t-14.t-normal")
                        else "",
                        "periodo": li.select_one("span.t-14.t-normal.t-black--light").get_text(strip=True)
                        if li.select_one("span.t-14.t-normal.t-black--light")
                        else "",
                        "descripcion": li.select_one("div.inline-show-more-text").get_text(strip=True)
                        if li.select_one("div.inline-show-more-text")
                        else "",
                    }
                )
            return exps

        def get_education(soup):
            edus = []
            for li in soup.select('section:has(h2:-soup-contains("Educación")) li'):
                edus.append(
                    {
                        "institucion": li.select_one("span[aria-hidden='true']").get_text(strip=True)
                        if li.select_one("span[aria-hidden='true']")
                        else "",
                        "titulo": li.select_one("span.t-14.t-normal").get_text(strip=True)
                        if li.select_one("span.t-14.t-normal")
                        else "",
                        "periodo": li.select_one("span.t-14.t-normal.t-black--light").get_text(strip=True)
                        if li.select_one("span.t-14.t-normal.t-black--light")
                        else "",
                    }
                )
            return edus

        def get_contact_info(text):
            emails = re.findall(r"[\w\.-]+@[\w\.-]+\.\w+", text)
            return {"emails": list(set(emails))}

        raw = json.loads(RAW_PATH.read_text(encoding="utf-8"))
        soup_perfil = BeautifulSoup(raw["perfil_html"], "lxml")

        perfil_limpio = {
            **get_profile_info(soup_perfil),
            "experiencia": get_experiences(soup_perfil),
            "educacion": get_education(soup_perfil),
            "contacto": get_contact_info(html2text(raw["contacto_html"])),
            "publicaciones": html2text(raw["publicaciones_html"])[:1000],
        }

        print("Perfil limpio:", perfil_limpio)

        # 7) Guardar limpio en BASE_DIR y borrar RAW ----------------------------
        CLEAN_PATH.write_text(json.dumps(perfil_limpio, ensure_ascii=False, indent=2), encoding="utf-8")
        RAW_PATH.unlink(missing_ok=True)  # elimina el raw
        print(f"📝 Limpio escrito en {CLEAN_PATH.relative_to(BASE_DIR)}")

    except Exception as e:  # noqa: BLE001
        print("🚨 Excepción general:", e)
        traceback.print_exc()
    finally:
        driver.quit()

