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
import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';
import MoneyIcon from '@mui/icons-material/AttachMoney';
import DescriptionIcon from '@mui/icons-material/Description';
import StateIcon from '@mui/icons-material/AccountBalance';
import StatusIcon from '@mui/icons-material/PaidOutlined';
import EditIcon from '@mui/icons-material/Edit';
import Details from '@mui/icons-material/Details';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import Favorite from '@mui/icons-material/Favorite';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import { Avatar, Badge, Button, Card, Checkbox, Dialog, Divider, Grid, InputLabel, List, ListItem, ListItemAvatar, ListItemIcon, ListItemText, styled, TextField, } from '@mui/material';
import { blue, green } from '@mui/material/colors';
import Layout from './Layout';
import useAuctions from './use-auctions';
import { useAuth } from './hooks/use-auth';



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
  const { numSelected, toggleFilters } = props;

  return (
    <Toolbar
      sx={{
        backgroundColor: '#DEEFF5',
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
        <IconButton onClick={toggleFilters}>
          <FilterListIcon />
        </IconButton>
      </Tooltip>
    </Toolbar>
  );
}

function SearchBar ({ searchByAddress }) {
  const [address, setAddress] = React.useState('')
  return (
    <Paper elevation={2} sx={{ padding: '2%', margin: '2%', backgroundColor: '#DEEFF5' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <TextField
          size='small'
          id="outlined-multiline-flexible"
          label="Search By Address"
          placeholder="Search By Address"
          sx={{ width: '80%', backgroundColor: 'white' }}
          value={address}
          onChange={(event) => setAddress(event.target.value)}
        />
        <Button
          sx={{ marginLeft: '2%' }}
          variant='contained'
          onClick={() => searchByAddress(address)}
        >
          Search <SearchIcon />
        </Button>
      </div>
    </Paper>
  )
}
function FilterComponent ({
  open,
  search,
}) {



  const onApplyFilters = async () => {
    let maxOpeningBid = document.getElementById('maximum-opening-bid')?.value;
    maxOpeningBid?.trim() === '' && (maxOpeningBid = 0)
    let minOpeningBid = document.getElementById('minimum-opening-bid')?.value;
    minOpeningBid?.trim() === '' && (minOpeningBid = 0)
    const enableOpeningBid = document.getElementById('checkbox-opening-bid')?.checked;

    let maxAssessedValue = document.getElementById('maximum-assessed-value')?.value;
    maxAssessedValue?.trim() === '' && (maxAssessedValue = 0)
    let minAssessedValue = document.getElementById('minimum-assessed-value')?.value;
    minAssessedValue?.trim() === '' && (minAssessedValue = 0)
    const enableAssessedValue = document.getElementById('checkbox-assessed-value')?.checked;

    let maxTotalPrice = document.getElementById('max-total-price')?.value;
    maxTotalPrice?.trim() === '' && (maxTotalPrice = 0)
    let minTotalPrice = document.getElementById('minimum-total-price')?.value;
    minTotalPrice?.trim() === '' && (minTotalPrice = 0)
    const enableTotalPrice = document.getElementById('checkbox-total-price')?.checked;

    const filter = {}

    if (enableOpeningBid) {
      if (!isNaN(maxOpeningBid)) {
        filter.openingBid = { ...filter.openingBid,$lt: maxOpeningBid }
      }
      if (!isNaN(minOpeningBid)) {
        filter.openingBid = {...filter.openingBid, $gt: minOpeningBid }
      }
    }

    if (enableAssessedValue) {
      if (!isNaN(maxAssessedValue)) {
        filter.assessedValue = {...filter.assessedValue, $lt: maxAssessedValue }
      }
      if (!isNaN(minAssessedValue)) {
        filter.assessedValue = { ...filter.assessedValue, $gt: minAssessedValue }
      }
    }

    if (enableTotalPrice) {
      if (!isNaN(maxTotalPrice)) {
        filter.totalPrice = {...filter.totalPrice, $lt: maxTotalPrice }
      }
      if (!isNaN(minTotalPrice)) {
        filter.totalPrice = {...filter.totalPrice, $gt: minTotalPrice }
      }
    }
    await search(filter)
  }

  return (open ? (
    <Card
      component="form"
      sx={{
        backgroundColor: '#DEEFF5',
        padding: '1%',
      }}
      noValidate
      autoComplete="off"
    >
      <Paper elevation={2} sx={{ margin: '2%', padding: '2%', backgroundColor: '#DEEFF5' }}>

        <div style={{ display: 'flex', alignItems: 'center' }}>
        <Checkbox id='checkbox-assessed-value' />
        <InlinedLabel variant='subtitle1' > Assessed Value </InlinedLabel>
          <TextField
            size='small'
            id="minimum-assessed-value"
            label="Minimum"
            placeholder="Minimum"
            type='number'
          />

          <TextField
            size='small'
            id="maximum-assessed-value"
            label="Maximum"
            placeholder="Maximum"
            type='number'
          />
        </div>


        <div style={{ display: 'flex', alignItems: 'center' }}>
        <Checkbox id='checkbox-total-price' />
        <InlinedLabel variant='subtitle1' > Total Price (Property upraiser)</InlinedLabel>

          <TextField
            size='small'
            id="minimum-total-price"
            label="Minimum"
            placeholder="Minimum"
            type='number'
          />

          <TextField
            size='small'
            id="max-total-price"
            label="Maximum"
            placeholder="Maximum"
            type='number'
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center' }}>
        <Checkbox id='checkbox-opening-bid' />
        <InlinedLabel variant='subtitle1' > Opening Bid</InlinedLabel>

          <TextField
            size='small'
            id="minimum-opening-bid"
            label="Minimum"
            placeholder="Minimum"
            type='number'
          />

          <TextField
            size='small'
            id="maximum-opening-bid"
            label="Maximum"
            placeholder="Maximum"
            type='number'
          />
        </div>

        <div
          style={{
            display: 'inline',
            margin: '1% 1% 1% 0',
            padding: '1% 1% 1%, 0',
          }}>
          <Button variant='contained' color='primary' onClick={onApplyFilters}> Apply Filters </Button>
        </div>

      </Paper>
    </Card>
  ) : null
  )
}

export default function EnhancedTable () {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('auctionDate');
  const [dense, setDense] = React.useState(false);
  const [filterOpen, setFilterOpen] = React.useState(false);


  const toggleFilters = () => {
    const isFilterOpen = !filterOpen
    if (!isFilterOpen) {
      //  clear filters
    }

    setFilterOpen(isFilterOpen)
  }

  const {
    auctions: rows,
    cursors,
    loading,
    page,
    onChangePage,
    updateAuctionField,
    searchByAddress,
    searchWithFilter,
    updateLegalDocNotes,
  } = useAuctions()

  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [dialogDocuments, setDialogDocuments] = React.useState([])
  const [documentParcelID, setDocumentParcelID] = React.useState(null)

  const closeDocumentsDialog = () => {
    setDocumentParcelID(null)
    setDialogOpen(false)
  }

  const openDocumentsDialog = (documents, parcelID) => {
    setDocumentParcelID(parcelID)
    setDialogDocuments(documents)
    setDialogOpen(true)
  }

  const hasPreviousCursor = page > 0
  const hasNextCursor = cursors[page + 1]

  const visibleRows = React.useMemo(
    () =>
      stableSort(rows, getComparator(order, orderBy)),
    [order, orderBy, rows],
  );


  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };


  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };



  return (
    <>

      <SearchBar searchByAddress={searchByAddress} />
      <Box sx={{ width: '100%' }}>
        <Paper sx={{ width: '100%', mb: 2 }}>
          <EnhancedTableToolbar toggleFilters={toggleFilters} />
          <TableContainer>
            {loading && (<Backdrop
              sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={loading}
            >
              <CircularProgress color="inherit" />
            </Backdrop>)
            }

            <DocumentsDialog
              documents={dialogDocuments}
              onClose={closeDocumentsDialog}
              open={dialogOpen}
              key={`document-dialog-${dialogOpen}`}
              parcelID={documentParcelID}
              updateLegalDocNotes={updateLegalDocNotes}
            />


            <FilterComponent
            open={filterOpen}
            search={searchWithFilter}
            />

            <StyledTable
              sx={{ minWidth: 750 }}
              aria-labelledby="Auctions"
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
                    <ExpandableTableRow
                      updateAuctionField={updateAuctionField}
                      openDocsDialog={openDocumentsDialog}
                      row={row}
                      labelId={labelId} />
                  );
                })}
              </TableBody>
            </StyledTable>
          </TableContainer>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mt: 2,
            }}>
            <Button
              onClick={() => onChangePage(page - 1)}
              disabled={!hasPreviousCursor || loading} >
              Prev
            </Button>

            <Button
              onClick={() => onChangePage(page + 1)}
              disabled={!hasNextCursor || loading}
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
    </>
  );
}

// create ExpandableTableRow component

const ExpandableTableRow = ({ row, labelId, openDocsDialog, updateAuctionField }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const toggleExpanded = () => setIsExpanded(!isExpanded);
  const { user } = useAuth()
  const onFavoriteAdd = async (event) => {
    event.stopPropagation()
    try {
      await updateAuctionField(row._id, 'liked', [...row.liked, user])
    } catch (error) {
      console.log(error);
    }
  }

  const onFavoriteRemove = async (event) => {
    event.stopPropagation()
    try {
      await updateAuctionField(row._id, 'liked', row.liked.filter(liked => liked !== user))
    } catch (error) {
      console.log(error);
    }
  }

  const liked = row.liked?.includes(user)

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
          align={'center'}
          onClick={liked ? onFavoriteRemove : onFavoriteAdd}
        >

          {
            liked ?
              <Favorite />
              :
              <FavoriteBorder />
          }
        </TableCell>

        <TableCell align="center">{row.parcelID}</TableCell>
        <TableCell align="center">{row.caseNumber}</TableCell>

        <TableCell> {row.address} </TableCell>
        <TableCell align="center">{row.assessedValue + '$'}</TableCell>
        <TableCell align="center">{formatDate(row.auctionDate)}</TableCell>
        <TableCell align="center">{row.caseType}</TableCell>
        <TableCell align="center">{row.description}</TableCell>
      </TableRow>

      {isExpanded && (
        <>
                  <TableRow>
            <TableCell colSpan={8}>
              <NotesField
                        primaryText='Notes'
                        secondaryText={row.noted}
                        updateAuctionField={updateAuctionField.bind(null, row._id, 'noted')}
                        fullWidth
                      />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={8}>
              <Grid container>

                <Grid item xs={7}>
                  {row.owners?.length > 0 &&
                    <>
                      <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                        Owners:

                        {
                          row.owners?.map((owner, index) => {
                            return (
                              <ListItem key={`${owner.name - index}`}>
                                <ListItemAvatar>
                                  <Avatar sx={{ bgcolor: blue[500] }}>
                                    <PersonIcon />
                                  </Avatar>
                                </ListItemAvatar>
                                {owner.name} <br />
                              </ListItem>
                            )
                          })
                        }
                      </List>
                  <Divider />
                    </>
                  }

                  {row.partyDetails?.length > 0 &&
                    <>
                      <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                        Party Details :
                        {
                          row.partyDetails.map((obj, index) => {
                            const property = Object.keys(obj)[0]
                            return (
                              <ListItem key={`party-details-${index}`}>
                                <ListItemAvatar>
                                  <Avatar sx={{ bgcolor: blue[300] }}>
                                    <Details />
                                  </Avatar>
                                </ListItemAvatar>
                                {property} : {obj[property]}
                              </ListItem>
                            )
                          })
                        }
                      </List>
                      <Divider />
                    </>
                  }
                  {row.legalDocuments?.length > 0 && row.legalDocuments.some(array => array.length > 0) &&
                    <>
                      Legal Documents:
                      {
                        row.legalDocuments.map((arrayOfDocs, index) => {
                          if (arrayOfDocs.length === 0) return null
                          return (
                            <ListItem>
                              <ListItemAvatar onClick={() => openDocsDialog(arrayOfDocs, row?.parcelID)}>

                                <Badge badgeContent={arrayOfDocs.length} color="primary">
                                  <Avatar sx={{ bgcolor: green[300] }}>
                                    <DescriptionIcon />
                                  </Avatar>
                                </Badge>
                              </ListItemAvatar>
                              {arrayOfDocs[0]?.firstParty}
                            </ListItem>
                          )
                        })
                      }
                      <Divider />
                    </>
                  }
                  <Divider />
                  {row.violations?.length > 0 &&
                    <>
                      <Typography m={1} p={1}>
                        violations :<br />
                        {row.violations.map((violation, index) => {
                          return (
                            <>
                              Violation #{index + 1}
                              <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                                <ListItem>
                                  <ListItemAvatar>
                                    <Avatar sx={{ bgcolor: blue[500] }}>
                                      <MoneyIcon />
                                    </Avatar>
                                  </ListItemAvatar>
                                  amount: {violation.amount}
                                </ListItem>
                                <ListItem>
                                  <ListItemAvatar>
                                    <Avatar sx={{ bgcolor: blue[500] }}>
                                      <StatusIcon
                                        color={violation?.status?.trim().toLowerCase() === 'closed'
                                          ? 'success'
                                          : 'error'} />

                                    </Avatar>
                                  </ListItemAvatar>
                                  status: {violation.status}
                                </ListItem>
                                <ListItem>
                                  <ListItemAvatar>
                                    <Avatar sx={{ bgcolor: blue[500] }}>
                                      <DescriptionIcon />
                                    </Avatar>
                                  </ListItemAvatar>
                                  description: {violation.description}
                                </ListItem>
                                <ListItem>
                                  <ListItemAvatar>
                                    <Avatar sx={{ bgcolor: blue[500] }}>
                                      <StateIcon />
                                    </Avatar>
                                  </ListItemAvatar>
                                  codeSection: {violation.codeSection}
                                </ListItem>
                              </List>
                            </>
                          );
                        })}
                      </Typography>
                      <Divider />
                    </>

                  }

                  <List>

                    <ListItem>
                      <ListItemText primary="Auction Date" secondary={formatDate(row.auctionDate)} />
                    </ListItem>
                    <Divider />

                    <ListItem>
                      <ListItemText primary="Case Number" secondary={row.caseNumber} />
                    </ListItem>
                    <Divider />

                    <ListItem>
                      <ListItemText primary="Opening Bid" secondary={row.openingBid + '$'} />
                    </ListItem>
                    <Divider />

                    <ListItem>
                      <ListItemText primary="Case Type" secondary={row.caseType} />
                    </ListItem>
                    <Divider />

                    <ListItem>
                      <ListItemText primary="Parcel ID" secondary={row.parcelID} />
                    </ListItem>
                    <Divider />

                    <ListItem>
                      <ListItemText primary="Certificate Number" secondary={row.certificateNumber} />
                    </ListItem>
                    <Divider />

                    <ListItem>
                      <ListItemText primary="Assessed Value" secondary={row.assessedValue + '$'} />
                    </ListItem>
                    <Divider />

                    <ListItem>
                      <ListItemText primary="Property Appraiser Description" secondary={row.propertyAppraiserLegalDescription} />
                    </ListItem>
                    <Divider />

                    <ListItem>
                      <ListItemText primary="Address" secondary={row.address} />
                    </ListItem>
                    <Divider />

                    <ListItem>
                      <ListItemText primary="Tax Collector Debt" secondary={row?.taxCollectorDebt + "$" || 'None'} />
                    </ListItem>
                    <Divider />

                    <ListItem>
                      <ListItemText primary="Bedrooms" secondary={row.bedrooms} />
                    </ListItem>
                    <Divider />

                    <ListItem>
                      <ListItemText primary="Bathrooms" secondary={row.bathrooms} />
                    </ListItem>
                    <Divider />

                    <ListItem>
                      <ListItemText primary="Municipality" secondary={row.municipality} />
                    </ListItem>
                    <Divider />

                    <ListItem>
                      <ListItemText primary="Lot size" secondary={row.lotSize} />
                    </ListItem>
                    <Divider />

                    <ListItem>
                      <ListItemText primary="Primary Land Use" secondary={row.primaryLandUse} />
                    </ListItem>
                    <Divider />

                    <ListItem>
                      <ListItemText primary="Living Area" secondary={row.livingArea} />
                    </ListItem>
                    <Divider />

                    <ListItem>
                      <ListItemText primary="Year Built" secondary={row.yearBuilt} />
                    </ListItem>
                    <Divider />

                    <ListItem>
                      <ListItemText primary="Primary Zone" secondary={row.primaryZone} />
                    </ListItem>
                    <Divider />

                    <ListItem>
                      <ListItemText primary="Subdivision" secondary={row.subdivision} />
                    </ListItem>
                    <Divider />

                    <ListItem>
                      <ListItemText primary="Neighborhood" secondary={row.neighborhood} />
                    </ListItem>
                    <Divider />


                    <ListItem>
                      <ListItemText primary="Building Area" secondary={row.buildingArea} />
                    </ListItem>
                    <Divider />

                    <ListItem>
                      <ListItemText primary="Description" secondary={row.description} />
                    </ListItem>
                    <Divider />

                    <ListItem>
                      <ListItemText primary="Units" secondary={row.units} />
                    </ListItem>
                    <Divider />

                  </List>

                </Grid>

                <Grid item xs={5}>

                  {row.qualifiedOwners?.length > 0 &&
                    <>
                      <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                        Qualified Owners:
                        {
                          row.qualifiedOwners.map((owner, index) => {
                            return (
                              <ListItem>
                                <ListItemAvatar>
                                  <Avatar sx={{ bgcolor: green[200] }}>
                                    <PersonIcon />
                                  </Avatar>
                                </ListItemAvatar>
                                {owner}
                              </ListItem>
                            )
                          })
                        }
                      </List>
                      <Divider />
                    </>
                  }
                  <>
                    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                    </List>
                    <List>
                      <EditableField
                        primaryText={'Light'}
                        secondaryText={row?.light}
                        updateAuctionField={updateAuctionField.bind(null, row._id, 'light')}
                      />
                      <Divider />

                      <EditableField
                        primaryText={'Liens'}
                        secondaryText={row?.liens}
                        updateAuctionField={updateAuctionField.bind(null, row._id, 'liens')}
                      />
                      <Divider />

                      <EditableField
                        primaryText={'Status'}
                        secondaryText={row?.status}
                        updateAuctionField={updateAuctionField.bind(null, row._id, 'status')}
                      />
                      <Divider />

                      <EditableField
                        primaryText={'DD Market Value Assessment'}
                        secondaryText={row?.ddMarketValueAssessment}
                        updateAuctionField={updateAuctionField.bind(null, row._id, 'ddMarketValueAssessment')}
                      />
                      <Divider />

                      <EditableField
                        primaryText={'DD Title'}
                        secondaryText={row.dDTitle}
                        updateAuctionField={updateAuctionField.bind(null, row._id, 'dDTitle')}
                      />
                      <Divider />

                      <EditableField
                        primaryText={'DD Zoning'}
                        secondaryText={row.dDZoning}
                        updateAuctionField={updateAuctionField.bind(null, row._id, 'dDZoning')}
                      />
                      <Divider />

                      <EditableField
                        primaryText={'DD Property Appraiser'}
                        secondaryText={row.dDPropertyAppraiser}
                        updateAuctionField={updateAuctionField.bind(null, row._id, 'dDPropertyAppraiser')}
                      />
                      <Divider />

                      <EditableField
                        primaryText={'DD Lien Assessment'}
                        secondaryText={row.dDLienAssessment}
                        updateAuctionField={updateAuctionField.bind(null, row._id, 'dDLienAssessment')}
                      />
                      <Divider />

                      <EditableField
                        primaryText={'DD Code Enforcement'}
                        secondaryText={row.dDCodeEnforcement}
                        updateAuctionField={updateAuctionField.bind(null, row._id, 'dDCodeEnforcement')}
                      />
                      <Divider />

                      <EditableField
                        primaryText={'DD Corporate Of Divisions'}
                        secondaryText={row.dDCorporateOfDivisions}
                        updateAuctionField={updateAuctionField.bind(null, row._id, 'dDCorporateOfDivisions')}
                      />
                      <Divider />

                      <EditableField
                        primaryText={'Keyword'}
                        secondaryText={row.keyword}
                        updateAuctionField={updateAuctionField.bind(null, row._id, 'keyword')}
                      />
                      <Divider />

                      <EditableField
                        primaryText={'As Is Value'}
                        secondaryText={row.asIsValue}
                        updateAuctionField={updateAuctionField.bind(null, row._id, 'asIsValue')}
                      />
                      <Divider />

                      <EditableField
                        primaryText={'ARV'}
                        secondaryText={row.arv}
                        updateAuctionField={updateAuctionField.bind(null, row._id, 'arv')}
                      />
                      <Divider />

                      <EditableField
                        primaryText={'BRR 70%'}
                        secondaryText={row.brr70Percent}
                        updateAuctionField={updateAuctionField.bind(null, row._id, 'brr70Percent')}
                      />
                      <Divider />

                      <EditableField
                        primaryText={'60% Of Current Value'}
                        secondaryText={row.sixtyPercentageCurrentValue}
                        updateAuctionField={updateAuctionField.bind(null, row._id, 'sixtyPercentageCurrentValue')}
                      />
                      <Divider />

                      <EditableField
                        primaryText={'Rehab Costs'}
                        secondaryText={row.rehabCosts}
                        updateAuctionField={updateAuctionField.bind(null, row._id, 'rehabCosts')}
                      />
                      <Divider />

                      <EditableField
                        primaryText={'Max Bid'}
                        secondaryText={row.maxBid}
                        updateAuctionField={updateAuctionField.bind(null, row._id, 'maxBid')}
                      />
                      <Divider />

                      <EditableField
                        primaryText={'Max Bid Based On As Is Value'}
                        secondaryText={row.maxBidBasedOnAsIsValue}
                        updateAuctionField={updateAuctionField.bind(null, row._id, 'maxBidBasedOnAsIsValue')}
                      />
                      <Divider />

                      <EditableField
                        primaryText={'Profit As Percentage'}
                        secondaryText={row.profitAsPercentage}
                        updateAuctionField={updateAuctionField.bind(null, row._id, 'profitAsPercentage')}
                      />
                      <Divider />

                      <EditableField
                        primaryText={'Lien Type'}
                        secondaryText={row.lienType}
                        updateAuctionField={updateAuctionField.bind(null, row._id, 'lienType')}
                      />
                      <Divider />

                      <EditableField
                        primaryText={'Total Liens'}
                        secondaryText={row.totalLiens}
                        updateAuctionField={updateAuctionField.bind(null, row._id, 'totalLiens')}
                      />
                      <Divider />

                      <EditableField
                        primaryText={'Strategy'}
                        secondaryText={row.strategy}
                        updateAuctionField={updateAuctionField.bind(null, row._id, 'strategy')}
                      />
                      <Divider />

                      <EditableField
                        primaryText={'Strategy2'}
                        secondaryText={row.strategy2}
                        updateAuctionField={updateAuctionField.bind(null, row._id, 'strategy2')}
                      />
                      <Divider />

                      <EditableField
                        primaryText={'Owner'}
                        secondaryText={row.owner}
                        updateAuctionField={updateAuctionField.bind(null, row._id, 'owner')}
                      />
                      <Divider />

                      <EditableField
                        primaryText={'Owner Contact'}
                        secondaryText={row.ownerContact}
                        updateAuctionField={updateAuctionField.bind(null, row._id, 'ownerContact')}
                      />
                      <Divider />


                    </List>

                  </>
                </Grid>


              </Grid>
            </TableCell>
          </TableRow>
        </>
      )}
    </>
  );
};

/**
 * EditableField component props
 * @typedef { Object } EditableFieldProps
 * @property { string } primaryText
 * @property { string } secondaryText
 * @property { string } fieldName
 * @property { string } auctionId
 */
/** @type {React.FC<EditableFieldProps>} */
function EditableField ({
  primaryText,
  secondaryText,
  updateAuctionField,
}) {
  const [loading, setLoading] = React.useState(false)
  const [editing, setEditing] = React.useState(false)
  const [newText, setNewText] = React.useState(secondaryText || '')
  const saveChanges = async (newText) => {

    try {
      await updateAuctionField(newText)
    } catch (error) {
      console.log(error);
    }
  }

  const onClick = () => {
    setEditing(true)
  }

  const onSave = async () => {
    try {
      setLoading(true)
      await saveChanges(newText)
      setEditing(false)
    } catch (error) {
      console.log(error);
    }
    finally {
      setLoading(false)
    }
  }

  const onCancel = () => {
    setEditing(false)
  }

  return (
    <ListItem>
      <ListItemText primary={primaryText} secondary={
        editing ?
          <>
            <TextField
              size='small'
              variant="outlined"
              onChange={(event) => setNewText(event.target.value)}
              defaultValue={secondaryText || ''}
              focused
              multiline

            />
            <Layout>

            <Button disabled={loading} onClick={onSave}> Save </Button>
            <Button disabled={loading} onClick={onCancel}> Cancel </Button>
            </Layout>

          </>
          :
          (secondaryText || 'None')
      } />
      <ListItemIcon onClick={onClick}>
        {
          loading ?
            <CircularProgress size={20} />
            :
            <EditIcon fontSize="small" />
        }
      </ListItemIcon>
    </ListItem>
  );

}
function NotesField ({
  primaryText,
  secondaryText,
  updateAuctionField,
}) {
  const [loading, setLoading] = React.useState(false)
  const [editing, setEditing] = React.useState(false)
  const [newText, setNewText] = React.useState(secondaryText)

  const saveChanges = async (newText) => {
    try {
      await updateAuctionField(newText)
    } catch (error) {
      console.log(error);
    }
  }

  const onClick = () => {
    setEditing(true)
  }

  const onSave = async () => {
    try {
      setLoading(true)
      await saveChanges(newText)
      setEditing(false)
    } catch (error) {
      console.log(error);
      setNewText(secondaryText)
    }
    finally {
      setLoading(false)
    }
  }

  const onCancel = () => {
    setEditing(false)
  }

  return (
    editing ? (
      <>
      <p style={{display: 'grid'}}>
      <TextField
        size='small'
        variant="outlined"
        onChange={(event) => setNewText(event.target.value)}
        defaultValue={secondaryText || ''}
        focused
        multiline
        fullWidth
      />
    </p>
          <Button  disabled={loading} onClick={onSave}> Save </Button>
          <Button disabled={loading} onClick={onCancel}> Cancel </Button>
          </>
    ) : (
    <ListItem>
      <ListItemText
        primary={
            <Typography  variant='subtitle2'>
               {primaryText}
               </Typography>
        }
        secondary={ newText|| 'None' }
        secondaryTypographyProps={{ style: { whiteSpace: 'pre-wrap'}}}

       />
      <ListItemIcon onClick={onClick}>
        {
          loading ?
            <CircularProgress size={20} />
            :
            <EditIcon fontSize="small" />
        }
      </ListItemIcon>
    </ListItem>
    )
  );

}

function DocumentsDialog ({
  onClose,
  open,
  documents,
  parcelID,
  updateLegalDocNotes
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
    >
      <List>
        {documents.map((document) => {
          return (
            <>
            <ListItem>
              <ListItemAvatar onClick={() => window.open(document?.url, '_blank').focus()}>
                <Avatar>
                  <DescriptionIcon />
                </Avatar>
              </ListItemAvatar>

              <ListItemText primary={document?.firstParty} secondary={document?.secondParty} />
              <Layout>

                <Typography variant="subtitle1" color="textSecondary">
                  {document?.type}
                </Typography>

                <Typography variant="subtitle1" color="textSecondary">
                  {document?.date}
                </Typography>

                <Typography variant="subtitle2" color="textSecondary">
                  {document?.fileNumber}
                </Typography>
              </Layout>
            </ListItem>
            <ListItem>
              <Typography variant='subtitle2'> Notes</Typography>
            <NotesField
              primaryText=''
              secondaryText={document?.notes}
              updateAuctionField={(notes) => {
                updateLegalDocNotes({
                  parcelID,
                  fileNumber: document?.fileNumber,
                  notes,
                  })
              }}
              />
            </ListItem>
            <Divider />
            </>
          )
        })}
      </List>
    </Dialog>

  );
}

const formatDate = (date) => {
  // split on T and return the first part, make sure date is Date
  return new Date(date).toISOString().split('T')[0];

}
// style Table component
// .MuiTableHead-root background color #ADD8E6 and #tableTitle id should have color #DEEFF5
const StyledTable = styled(Table)`
  .MuiTableHead-root {
    background-color: #BCE6FF;
  }
  .MuiToolbar-root {
     color: #DEEFF5 !important;
  }
`;

const InlinedLabel = styled(InputLabel)`
  padding: 2%;
  margin: '2%'
  font-size: 1rem;
`;
