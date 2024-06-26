import * as React from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import Backdrop from '@mui/material/Backdrop';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import CircularProgress from '@mui/material/CircularProgress';
import KeyboardArrowUp from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';



import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import Favorite from '@mui/icons-material/Favorite';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import { Button } from '@mui/material';


function descendingComparator (a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator (order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort (array = [], comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: 'liked',
    numeric: false,
    disablePadding: true,
    label: '',
  },
  {
    id: 'parcelID',
    numeric: false,
    disablePadding: true,
    label: 'Parcel ID',
  },
  {
    id: 'caseNumber',
    numeric: false,
    disablePadding: true,
    label: 'Case Number',
  },
  {
    id: 'address',
    numeric: false,
    disablePadding: true,
    label: 'Adress',
  },
  {
    id: 'assessedValue',
    numeric: true,
    disablePadding: false,
    label: 'Assessed Value',
  },
  {
    id: 'auctionDate',
    numeric: false,
    disablePadding: false,
    label: 'Date',
  },
  {
    id: 'caseType',
    numeric: false,
    disablePadding: false,
    label: 'Case Type',
  },
  {
    id: 'description',
    numeric: false,
    disablePadding: false,
    label: 'Description',
  },
];

function EnhancedTableHead (props) {
  const { order, orderBy, onRequestSort } =
    props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={'center'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar (props) {
  const { numSelected } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      <Typography
        sx={{ flex: '1 1 100%' }}
        variant="h6"
        id="tableTitle"
        component="div"
        align='center'
      >
        Auctions
      </Typography>

      <Tooltip title="Filter list">
        <IconButton>
          <FilterListIcon />
        </IconButton>
      </Tooltip>
    </Toolbar>
  );
}



export default function EnhancedTable () {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rows, setRows] = React.useState([])
  const [nextCursor, setNextCursor] = React.useState(null)
  const [previousCursor, setPreviousCursor] = React.useState(null)
  const [loading, setLoading] = React.useState(false)

  const visibleRows = React.useMemo(
    () =>
      stableSort(rows, getComparator(order, orderBy)),
    [order, orderBy, rows],
  );

  React.useEffect(() => {
    async function fetchData () {
      try {
        setLoading(true)
        const response = await fetch('http://localhost:3000/auctions', {
          credentials: "include",
        })
          .then(response => response.json())

        setRows(response.auctions)
        setPreviousCursor(nextCursor)
        setNextCursor(response.nextCursor)
      } catch (error) {
        setRows([])
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()

  }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };


  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };


  const onChangePage = async (newPage) => {
    setPage(newPage)
    setLoading(true)
    const cursor = newPage > page ? nextCursor : previousCursor
    const newRows = await fetch(`http://localhost:3000/auctions?cursor=${cursor}`, {
      credentials: "include",
    })
      .then(response => response.json())
      .catch(error => console.error(error))
      .finally(() => setLoading(false))

    setRows(newRows.auctions)
    if (!newRows?.nextCursor) {
      setNextCursor(null)
    } else {
      setPreviousCursor(nextCursor)
      setNextCursor(newRows.nextCursor)
    }
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar />
        <TableContainer>
          {loading && (<Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={loading}
          >
            <CircularProgress color="inherit" />
          </Backdrop>)
          }
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
          >
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={rows?.length || 0}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                const labelId = `enhanced-table-checkbox-${index}`;
                return (
                  <ExpandableTableRow row={row} key={row.id} labelId={labelId} />
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mt: 2,
          }}>
          <Button
            onClick={() => onChangePage(page - 1)}
            disabled={!previousCursor} >
            Prev
          </Button>

          <Button
            onClick={(event) => onChangePage(page + 1)}
            disabled={!nextCursor}
          >
            Next
          </Button>
        </Box>

      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />
    </Box>
  );
}

// create ExpandableTableRow component

const ExpandableTableRow = ({ row, labelId }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const toggleExpanded = () => setIsExpanded(!isExpanded);

  return (
    <>
      <TableRow
        hover
        onClick={toggleExpanded}
        tabIndex={-1}
        key={row.id}
        sx={{ cursor: 'pointer' }}

      >
        <TableCell
          component="th"
          id={labelId}
          scope="row"
          padding="normal"
          align={'center'}>
          {
            row.liked?.includes('myuser-------------------------t4rgfergid') ?
              <Favorite />
              :
              <FavoriteBorder />
          }
        </TableCell>

        <TableCell align="center">{row.parcelID}</TableCell>
        <TableCell align="center">{row.caseNumber}</TableCell>

        <TableCell> {row.address} </TableCell>
        <TableCell align="center">{row.assessedValue + '$'}</TableCell>
        <TableCell align="center">{row.auctionDate}</TableCell>
        <TableCell align="center">{row.caseType}</TableCell>
        <TableCell align="center">{row.description}</TableCell>
      </TableRow>

      {isExpanded && (
        <>
          <TableRow>
            {/* show all the details of the auction in this row, it should look like a document */}
            <TableCell colSpan={4}>
              <Typography>
                auctionDate: {row.auctionDate}
              </Typography>
              <Typography>
                caseNumber: {row.caseNumber}
              </Typography>
              <Typography>
                caseType {row.caseType}
              </Typography>
              <Typography>
                openingBid: {row.parcelID}
              </Typography>
              <Typography>
                certificateNumber: {row.certificateNumber}
              </Typography>
              <Typography>
                assessedValue : {row.assessedValue}
              </Typography>
              <Typography>
                propertyAppraiserLegalDescription: {row.propertyAppraiserLegalDescription}
              </Typography>
                <Typography>
                  Party Details :
                  {
                    row.partyDetails.map((obj, index) => {
                      const property = Object.keys(obj)[0]
                      return (
                        <Typography key={index}>
                          {property} : {obj[property]}
                        </Typography>
                      )
                    })
                  }
                </Typography>
                <Typography>
                  Url : {row.url}
                </Typography>
                <Typography>
                  Bedrooms : {row.bedrooms}
                </Typography>                <Typography>
                  Bathrooms : {row.bathrooms}
                </Typography>
                <Typography>
                municipality : {row.municipality}
                </Typography>
                <Typography>
                lotSize : {row.lotSize}
                </Typography>                <Typography>
                primaryLandUse : {row.primaryLandUse}
                </Typography>
                <Typography>
                livingArea : {row.livingArea}
                </Typography>
                <Typography>
                yearBuilt : {row.yearBuilt}
                </Typography><Typography>
                primaryZone : {row.primaryZone}
                </Typography><Typography>
                subdivision : {row.subdivision}
                </Typography>
                <Typography>
                neighborhood : {row.neighborhood}
                </Typography>
                <Typography>
                buildingArea : {row.buildingArea}
                </Typography><Typography>
                description : {row.description}
                </Typography><Typography>
                units : {row.units}
                </Typography>
                <Typography>
                address : {row.address}
                </Typography>
                <Typography>
                owners : {
                  row.owners?.map((owner, index) => {
                    return (
                      <Typography key={index}>
                        Name: {owner.name} <br /> percentage: {owner.percentage}
                      </Typography>
                    )
                  })
                }
                </Typography>
                <Typography>
                taxCollectorDebt : {row.taxCollectorDebt}
                </Typography>
                <Typography>
                violations : 'Need to find an example to look at, come back later'
                </Typography>
                <Typography>
                qualifiedOwners : 'Need to find an example to look at, come back later'
                </Typography>
                <Typography>
                legalDocuments : 'Need to find an example to look at, come back later'
                </Typography>
                <Typography>
                liked : 'Need to find an example to look at, come back later'
                </Typography>
                <Typography>
                liens : 'Need to find an example to look at, come back later'
                </Typography>

            </TableCell>
            <TableCell colSpan={4}>
              <Typography>
                Description: {row.description}
              </Typography>
              <Typography>
                Auction Date: {row.date}
              </Typography>
              <Typography>
                Case Type: {row.caseType}
              </Typography>
              <Typography>
                Case Number: {row.caseNumber}
              </Typography>
            </TableCell>


          </TableRow>

        </>
      )}
    </>
  );
};


function ExpandedContent (row) {
  // show all the details of the auction

}
