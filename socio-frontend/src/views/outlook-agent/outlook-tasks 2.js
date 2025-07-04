'use client';

import * as React from 'react';

// material-ui
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';

import { GridRowModes, DataGrid, GridActionsCellItem, GridRowEditStopReasons } from '@mui/x-data-grid';

// project import
import MainCard from 'components/ui-component/cards/MainCard';
import CSVExport from 'views/forms/tables/tbl-exports';
import CardSecondaryAction from 'components/ui-component/cards/CardSecondaryAction';

// assets
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';

//Backend Service
import BackendService from 'api_services/backendService';
import { useEffect } from 'react';

// ==============================|| FULL FEATURED DATA GRID ||============================== //

export default function OutlookTaskTable() {
  const [rows, setRows] = React.useState([]);
  const [rowModesModel, setRowModesModel] = React.useState({});
    
  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (row) => () => {
    setRowModesModel({ ...rowModesModel, [row.id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (row) => async () => {
    setRowModesModel({ ...rowModesModel, [row.id]: { mode: GridRowModes.View } });
    const accessToken = localStorage.getItem('serviceToken');
    const updatedRow = { ...row, task_description: row.row.task_description };
    const { data, status } = await BackendService.patchOutlookTasks(accessToken,row.id, updatedRow);
  };

  const handleDeleteClick = (row) => async () => {
    setRows(rows.filter((r) => r.id !== row.id));
    const accessToken = localStorage.getItem('accessToken');
    const { data, status } = await BackendService.deleteOutlookTasks(accessToken,row.id);
  };

  const handleCancelClick = (row) => () => {
    setRowModesModel({
      ...rowModesModel,
      [row.id]: { mode: GridRowModes.View, ignoreModifications: true }
    });

    const editedRow = rows.find((r) => r.id === row.id);
    if (editedRow.isNew) {
      setRows(rows.filter((r) => r.id !== row.id));
    }
  };

  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);  
  };
  
  const handleApproveTask = (row) => async () => {
    const accessToken = localStorage.getItem('accessToken');
    const updatedRow = { ...row, status: 'Completed' };
    setRows(rows.map((r) => (r.id === row.id ? updatedRow : r)));
    const { data, status } = await BackendService.getExecuteTask(accessToken,row.id);
  }

  useEffect(() => {
    const fetchOutlookTasks = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const { data, status } = await BackendService.getOutlookTasks(accessToken);
        setRows(data || []);
    } catch (error) {
        console.error('Error fetching Outlook tasks:', error);
      }
    };
    fetchOutlookTasks();
  }, []);

  const columns = [
    { field: 'id', headerName: 'id', flex: 1, maxWidth: 100 },
    {
      headerName: 'Meeting',
      type: 'text',
      minWidth: 180,
      align: 'left',
      headerAlign: 'left',
      valueGetter: (params) => params.row.meeting?.subject || '',
      renderCell: (params) => (
        <Tooltip title={params.row.meeting?.subject || ''} arrow>
          <span>{params.row.meeting?.subject || ''}</span>
        </Tooltip>
      )
    },
    {
      flex: 0.5,
      field: 'task_description',
      headerName: 'Task',
      type: 'text',
      minWidth: 300,
      align: 'left',
      headerAlign: 'left',
      editable: true,
      renderCell: (params) => (
        <Tooltip title={params.row?.task_description || ''} arrow>
          <span>{params.row?.task_description || ''}</span>
        </Tooltip>
      )
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 140,
      type: 'singleSelect',
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      flex: 0.75,
      maxWidth: 170,
      cellClassName: 'actions',
      getActions: (p) => {
        const isInEditMode = rowModesModel[p.id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              key={p.id}
              component={IconButton}
              size="large"
              icon={<SaveIcon color="secondary" sx={{ fontSize: '1.3rem' }} />}
              label="Save"
              sx={{
                color: 'primary.main'
              }}
              onClick={handleSaveClick(p)}
            />,
            <GridActionsCellItem
              key={p.id}
              component={IconButton}
              size="large"
              icon={<CancelIcon color="error" sx={{ fontSize: '1.3rem' }} />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(p)}
            />
          ];
        }

        return [
          <GridActionsCellItem
            key={p.id}
            component={IconButton}
            size="large"
            icon={<EditTwoToneIcon color="secondary" sx={{ fontSize: '1.3rem' }} />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(p)}
            color="inherit"
          />,
          <GridActionsCellItem
            key={p.id}
            component={IconButton}
            size="large"
            icon={<DeleteIcon color="error" sx={{ fontSize: '1.3rem' }} />}
            label="Delete"
            onClick={handleDeleteClick(p)}
            color="inherit"
          />,
          <GridActionsCellItem
            key={p.id}
            component={IconButton}
            size="large"
            icon={<DoneOutlineIcon color="success" sx={{ fontSize: '1.3rem' }} />}
            label="Delete"
            onClick={handleApproveTask(p)}
            color="inherit"
          />
        ];
      }
    }
  ];

  const headers = [];
  columns.map((item) => headers.push({ label: item.headerName, key: item.field }));

  return (
    <MainCard
      content={false}
      title="Approved Outlook Tasks"
      secondary={
        <Stack direction="row" spacing={2} alignItems="center">
          <CSVExport data={rows} filename="full-featured-data-grid-table.csv" header={headers} />
          <CardSecondaryAction link="https://mui.com/x/react-data-grid/editing/#full-featured-crud" />
        </Stack>
      }
    >
      <Box
        sx={{
          width: '100%',
          '& .MuiDataGrid-root': {
            '& .MuiDataGrid-cell--editing': {
              '& .MuiInputBase-root': {
                width: 150,
                '& .MuiSelect-select': {
                  pt: 0.75,
                  pb: 0.75
                }
              }
            },
            '& .MuiDataGrid-row--editing': {
              boxShadow: 'none'
            }
          }
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          editMode="row"
          rowModesModel={rowModesModel}
          hideFooter
          autoHeight
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
          slotProps={{ toolbar: { setRows, setRowModesModel } }}
        />
      </Box>
    </MainCard>
  );
}
