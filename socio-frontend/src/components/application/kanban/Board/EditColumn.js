import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';

// project imports
import { dispatch, useSelector } from 'store';
import { editColumn } from 'store/slices/kanban';

import { ThemeMode } from 'config';

// ==============================|| KANBAN BOARD - COLUMN EDIT ||============================== //

const EditColumn = ({ column }) => {
  const theme = useTheme();

  const { columns } = useSelector((state) => state.kanban);

  const handleColumnRename = (event) => {
    dispatch(
      editColumn(
        {
          id: column.id,
          title: event.target.value,
          itemIds: column.itemIds
        },
        columns
      )
    );
  };

  return (
    <>
      {column && (
        <OutlinedInput
          fullWidth
          value={column.title}
          onChange={handleColumnRename}
          sx={{
            mb: 1.5,
            '& input:focus': {
              bgcolor: theme.palette.mode === ThemeMode.DARK ? theme.palette.dark[800] : theme.palette.grey[50]
            },
            '& input:hover': {
              bgcolor: theme.palette.mode === ThemeMode.DARK ? theme.palette.dark[800] : theme.palette.grey[50]
            },
            '& input:hover + fieldset': {
              display: 'block'
            },
            '&, & input': { bgcolor: 'transparent' },
            '& fieldset': { display: 'none' },
            '& input:focus + fieldset': { display: 'block' }
          }}
          placeholder="title"
        />
      )}
    </>
  );
};

EditColumn.propTypes = {
  column: PropTypes.object
};

export default EditColumn;
