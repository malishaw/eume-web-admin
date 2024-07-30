
import PropTypes from 'prop-types';
import { useEffect, useState, useMemo } from 'react';
import { Box, Button, TextField, Stack, useTheme, Dialog, Pagination } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import MainCard from 'components/MainCard';

import { db } from 'config/firebase';
import { getDocs, collection, getDoc, doc } from 'firebase/firestore';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { PopupTransition } from 'components/@extended/Transitions';
import FilterModal from './components/FilterModal';

import Filter from './components/Filter';
import { useTranslation } from 'react-i18next';
import CSVExport from 'components/third-party/react-table/CSVExport';
import CSVImport from 'components/third-party/react-table/CSVImport';
import useAuth from 'hooks/useAuth';


const EditableTable = ({ data }) => {

  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [empList, setEmpList] = useState([]);
  const [page, setPage] = useState(1);
  
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchValue, setSearchValue] = useState('');
  const [sorting, setSorting] = useState({ field: 'date', sort: 'desc' });

  const empCollectionRef = collection(db, 'survey_data');

  const fetchMunicipalities = async (roleIds) => {
    const municipalities = new Set();
    for (const roleId of roleIds) {
      const roleDoc = await getDoc(doc(db, 'roles', roleId));
      if (roleDoc.exists()) {
        const roleData = roleDoc.data();
        if (Array.isArray(roleData.municipality)) {
          roleData.municipality.forEach((municipality) => municipalities.add(municipality));
        }
      }
    }
    return Array.from(municipalities);
  };

  useEffect(() => {
    const getEmpList = async () => {
      try {
        const municipalities = await fetchMunicipalities(user.role);
        const data = await getDocs(empCollectionRef);
        const filteredData = data?.docs?.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        let searchedData = filteredData.filter((item) => municipalities.includes(item.municipality));

        if (searchValue) {
          searchedData = searchedData.filter(
            (item) =>
              item.placeOfOrigin.toLowerCase().includes(searchValue.toLowerCase()) ||
              item.province.toLowerCase().includes(searchValue.toLowerCase()) ||
              item.gender.toLowerCase().includes(searchValue.toLowerCase()) ||
              item.motivation.toLowerCase().includes(searchValue.toLowerCase()) ||
              item.modality.toLowerCase().includes(searchValue.toLowerCase()) ||
              item.stayPlace.toLowerCase().includes(searchValue.toLowerCase()) ||
              item.accommodationType.toLowerCase().includes(searchValue.toLowerCase()) ||
              item.transportation.toLowerCase().includes(searchValue.toLowerCase()) ||
              item.age.includes(searchValue) ||
              item.noOfDays.includes(searchValue)
          );
        }

        setEmpList(searchedData);
      } catch (err) {
        console.log(err);
      }
    };

    getEmpList();
  }, [searchValue, user.role]);

  // const columns = useMemo(() => [
  //   { field: 'date', headerName: t('Date'), flex: 1, editable: true },
  //   { field: 'municipality', headerName: t('Municipality'), flex: 1, editable: true },
  //   // Add more columns as needed
  // ], [t]);
  const columns = useMemo(() => [
    { field: 'date', headerName: t('Date'), flex: 1, editable: true, cellClassName: 'cell-center' },
    { field: 'municipality', headerName: t('Municipality'), flex: 1, editable: true, cellClassName: 'cell-center' },
    {
      field: 'gender',
      headerName: t('Gender'),
      flex: 1,
      editable: true,
      cellClassName: 'cell-center',
      renderCell: ({ row }) => t(row.gender),
    },
    { field: 'age', headerName: t('Age'), flex: 1, editable: true, cellClassName: 'cell-center' },
    { field: 'reason', headerName: t('Reason'), flex: 1, editable: true, cellClassName: 'cell-center' },
    {
      field: 'modality',
      headerName: t('Modality'),
      flex: 1,
      editable: true,
      cellClassName: 'cell-center',
      renderCell: ({ row }) => t(row.modality),
    },
    {
      field: 'withPet',
      headerName: t('With Pet'),
      flex: 1,
      editable: true,
      cellClassName: 'cell-center',
      renderCell: ({ row }) => t(row.withPet),
    },
    {
      field: 'stayOvernight',
      headerName: t('Stay Overnight'),
      flex: 1,
      editable: true,
      cellClassName: 'cell-center',
      renderCell: ({ row }) => t(row.stayOvernight),
    },
    {
      field: 'stayPlace',
      headerName: t('Stay Place'),
      flex: 1,
      editable: true,
      cellClassName: 'cell-center',
      renderCell: ({ row }) => t(row.stayPlace),
    },
    { field: 'noOfDays', headerName: t('No of Days'), flex: 1, editable: true, cellClassName: 'cell-center' },
    {
      field: 'accommodationType',
      headerName: t('Accommodation Type'),
      flex: 1,
      editable: true,
      cellClassName: 'cell-center',
      renderCell: ({ row }) => t(row.accommodationType),
    },
    {
      field: 'transportation',
      headerName: t('Transportation'),
      flex: 1,
      editable: true,
      cellClassName: 'cell-center',
      renderCell: ({ row }) => t(row.transportation),
    },
    {
      field: 'activity',
      headerName: t('Activity'),
      flex: 1,
      editable: true,
      cellClassName: 'cell-center',
      renderCell: ({ row }) => t(row.activity),
    },
    { field: 'language', headerName: t('Language'), flex: 1, editable: true, cellClassName: 'cell-center' },
    {
      field: 'motivation',
      headerName: t('Motivation'),
      flex: 1,
      editable: true,
      cellClassName: 'cell-center',
      renderCell: ({ row }) => t(row.motivation),
    },
    { field: 'noOfPeople', headerName: t('No Of People'), flex: 1, editable: true, cellClassName: 'cell-center' },
    {
      field: 'placeOfOrigin',
      headerName: t('Place of Origin'),
      flex: 1,
      editable: true,
      cellClassName: 'cell-center',
      renderCell: ({ row }) => t(row.placeOfOrigin),
    },
    {
      field: 'province',
      headerName: t('Province'),
      flex: 1,
      editable: true,
      cellClassName: 'cell-center',
      renderCell: ({ row }) => t(row.province),
    },
    {
      field: 'transportationReason',
      headerName: t('Transportation Reason'),
      flex: 1,
      editable: true,
      cellClassName: 'cell-center',
    },
  ], [t]);
  

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleSortChange = (sortModel) => {
    if (sortModel.length > 0) {
      setSorting(sortModel[0]);
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const PER_PAGE = 10;
  const count = Math.ceil(empList.length / PER_PAGE);
  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return empList.slice(start, end);
  }, [empList, page, rowsPerPage]);

  return (
    <MainCard
      content={false}
      title={t('Survey Table')}
      subheader={`${empList.length} ${t('Basic Surveys')}`}
      secondary={
        <Stack direction="row" spacing={5} justifyContent="center" alignItems="center">
          <TextField
            sx={{
              borderRadius: '4px',
              bgcolor: theme.palette.background.paper,
              boxShadow: theme.customShadows.primary,
              border: `1px solid ${theme.palette.primary.main}`,
            }}
            InputProps={{
              startAdornment: <SearchOutlined />,
              placeholder: t('Search'),
              type: 'search',
            }}
            value={searchValue}
            onChange={handleSearchChange}
          />
          <Button
            size="small"
            sx={{ minWidth: '130px', minHeight: '41.13px' }}
            startIcon={<PlusOutlined />}
            color="primary"
            variant="contained"
            onClick={() => setOpenStoryDrawer((prevState) => !prevState)}
          >
            {t('Filter Options')}
          </Button>
          <Button
            size="small"
            sx={{ minWidth: '130px', minHeight: '41.13px' }}
            color="error"
            variant="contained"
            onClick={() => ResetTable()}
          >
            {t('Reset Filter')}
          </Button>
          <CSVExport data={empList} filename="basic-survey.csv" />
          <CSVImport collectionRef={empCollectionRef} headers={columns.map(col => ({ label: col.headerName, key: col.field }))} />
        </Stack>
      }
    >
      <Box sx={{ overflowX: 'auto', maxHeight: 'calc(100vh - 200px)' }}>
        <DataGrid
          rows={paginatedData}
          columns={columns}
          pagination
          pageSize={rowsPerPage}
          rowCount={count}
          page={page - 1}
          onPageChange={(params) => setPage(params.page + 1)}
          sortingOrder={['asc', 'desc']}
          sortModel={[sorting]}
          onSortModelChange={handleSortChange}
          autoHeight
          disableColumnFilter
        />
      </Box>
      <Pagination count={count} page={page} onChange={handlePageChange} />
    </MainCard>
  );
};

EditableTable.propTypes = {
  data: PropTypes.array.isRequired,
};

export default EditableTable;


















