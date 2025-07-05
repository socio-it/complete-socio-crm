from rest_framework import serializers
from .models import *

class PartnersSerializer(serializers.ModelSerializer):
    class Meta:
        depth = 1
        fields = '__all__'
        model = PartnerRole
