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
import MoneyIcon from '@mui/icons-material/AttachMoney';
import DescriptionIcon from '@mui/icons-material/Description';
import StateIcon from '@mui/icons-material/AccountBalance';
import StatusIcon from '@mui/icons-material/PaidOutlined';
import Details from '@mui/icons-material/Details';







import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import Favorite from '@mui/icons-material/Favorite';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import { Avatar, Badge, Button, Dialog, Divider, Grid, List, ListItem, ListItemAvatar, ListItemText,} from '@mui/material';
import { blue } from '@mui/material/colors';


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
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [dialogDocuments, setDialogDocuments] = React.useState([])
  const closeDocumentsDialog = () => setDialogOpen(false)
  const openDocumentsDialog = (documents) => {
    setDialogDocuments(documents)
    setDialogOpen(true)
  }


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
    <>
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
            <DocumentsDialog
            documents={dialogDocuments}
            handleClose={closeDocumentsDialog}
            open={dialogOpen}
            key={`Document-dialog-${dialogOpen}`}
          />
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
                    <ExpandableTableRow openDocsDialog={openDocumentsDialog} row={row} key={row.id} labelId={labelId} />
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
    </>
  );
}

// create ExpandableTableRow component

const ExpandableTableRow = ({ row, labelId, openDocsDialog }) => {
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
                          <ListItem>
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
                </>
              }
              <Divider />

              {row.partyDetails?.length > 0 &&
                <>
                  <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                    Party Details :
                    {
                      row.partyDetails.map((obj, index) => {
                        const property = Object.keys(obj)[0]
                        return (
                          <ListItem>
                            <ListItemAvatar>
                              <Avatar sx={{ bgcolor: blue[500] }}>
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
              { row.legalDocuments?.length > 0 && row.legalDocuments.some(array => array.length > 0) &&
                <>
                Legal Documents:
                {
                  row.legalDocuments.map((arrayOfDocs, index) => {
                    if (arrayOfDocs.length === 0) return null
                    return (
                      <ListItem>
                        <ListItemAvatar onClick={() => openDocsDialog(arrayOfDocs)}>

                          <Badge badgeContent={arrayOfDocs.length} color="primary">
                            <Avatar sx={{ bgcolor: blue[500] }}>
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
                <ListItemText primary="Auction Date" secondary={row.auctionDate} />
                </ListItem>
                <Divider />

                <ListItem>
                  <ListItemText primary="Case Number" secondary={row.caseNumber} />
                </ListItem>
                <Divider />

                <ListItem>
                  <ListItemText primary="Opening Bid" secondary={row.openingBid} />
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
                  <ListItemText primary="Assessed Value" secondary={row.assessedValue} />
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

            <Grid spacing={2} item xs={5}>

              {row.qualifiedOwners?.length > 0 &&
                <>
                  <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                    Qualified Owners:
                    {
                      row.qualifiedOwners.map((owner, index) => {
                        return (
                          <ListItem>
                            <ListItemAvatar>
                              <Avatar sx={{ bgcolor: blue[500] }}>
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
                <ListItem>
                  <ListItemText primary="Tax Collector Debt" secondary={row?.taxCollectorDebt || 'None'} />
                </ListItem>
                <Divider />

                <ListItem>
                  <ListItemText primary="Light" secondary={row?.light || 'None'} />
                </ListItem>
                <Divider />

                <ListItem>
                  <ListItemText primary="Liens" secondary={row.liens || 'None'} />
                </ListItem>
                <Divider />

                <ListItem>
                  <ListItemText primary="Status" secondary={row.status || 'None'} />
                </ListItem>
                <Divider />

                <ListItem>
                  <ListItemText primary="DD Market Value Assessment" secondary={row?.ddMarketValueAssessment || 'None'} />
                </ListItem>
                <Divider />

                <ListItem>
                  <ListItemText primary="DD Title" secondary={row?.dDTitle || 'None'} />
                </ListItem>
                <Divider />

              <EditableField primaryText={'DD Zoning'} secondaryText={row.dDZoning || 'None'} />
              <Divider />

              <EditableField primaryText={'DD Property Appraiser'} secondaryText={row.dDPropertyAppraiser || 'None'} />
              <Divider />

              <EditableField primaryText={'DD Lien Assessment'} secondaryText={row.dDLienAssessment || 'None'} />
              <Divider />

              <EditableField primaryText={'DD Code Enforcement'} secondaryText={row.dDCodeEnforcement || 'None'} />
              <Divider />

              <EditableField primaryText={'DD Corporate Of Divisions'} secondaryText={row.dDCorporateOfDivisions || 'None'} />
              <Divider />

              <EditableField primaryText={'Keyword'} secondaryText={row.keyword || 'None'} />
              <Divider />

              <EditableField primaryText={'As Is Value'} secondaryText={row.asIsValue || 'None'} />
              <Divider />

              <EditableField primaryText={'ARV'} secondaryText={row.arv || 'None'} />
              <Divider />

              <EditableField primaryText={'BRR 70%'} secondaryText={row.brr70Percent || 'None'} />
              <Divider />

              <EditableField primaryText={'60% Of Current Value'} secondaryText={row.sixtyPercentageCurrentValue || 'None'} />
              <Divider />

              <EditableField primaryText={'Rehab Costs'} secondaryText={row.rehabCosts || 'None'} />
              <Divider />

              <EditableField primaryText={'Max Bid'} secondaryText={row.maxBid || 'None'} />
              <Divider />

              <EditableField primaryText={'Max Bid Based On As Is Value'} secondaryText={row.maxBidBasedOnAsIsValue || 'None'} />
              <Divider />

              <EditableField primaryText={'Profit As Percentage'} secondaryText={row.profitAsPercentage || 'None'} />
              <Divider />

              <EditableField primaryText={'Lien Type'} secondaryText={row.lienType || 'None'} />
              <Divider />

              <EditableField primaryText={'Total Liens'} secondaryText={row.totalLiens || 'None'} />
              <Divider />

              <EditableField primaryText={'Strategy'} secondaryText={row.strategy || 'None'} />
              <Divider />

              <EditableField primaryText={'Strategy2'} secondaryText={row.strategy2 || 'None'} />
              <Divider />

              <EditableField primaryText={'Owner'} secondaryText={row.owner || 'None'} />
              <Divider />

              <EditableField primaryText={'Owner Contact'} secondaryText={row.ownerContact || 'None'} />
              <Divider />

              <EditableField primaryText={'Noted'} secondaryText={row.noted || 'None'} />
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

function EditableField ({ primaryText, secondaryText }) {




  return (
    <ListItem>
      <ListItemText  primary={primaryText} secondary={secondaryText} />
    </ListItem>
  );

}


function DocumentsDialog ({ handleClose, open, documents }) {

  return (
    <Dialog
      open={open}
      onClose={handleClose}
    >
      <List>
        {documents.map((document, index) => {
          return (
            <ListItem>
              <ListItemAvatar onClick={() => window.open(document?.url, '_blank').focus()}>
                <Avatar>
                  <DescriptionIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={document?.firstParty} secondary={document?.secondParty} />
            </ListItem>
          )
        })}
      </List>
    </Dialog>

  );
}
