import React from 'react';
import { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import { TableFooter, Typography } from '@material-ui/core'; 
import EnhancedTableHeadComponent from './EnhancedTableHeadComponent';
import InventoryRowComponent from './InventoryRowComponent';
import InventoryItemDialog from './InventoryItemDialog'
import { TextField } from '@material-ui/core';
import { Button } from '@material-ui/core';
import SellerPaginationComponent from './SellerPaginationComponent';

import './SellerTableComponent.css';
import SellerTableSearchComponent from './SellerTableSearchComponent';
import { HeadCell, Order, InventoryItem } from '../../Utils/SellerUtility';

interface SellerTableProps {
  headCells:HeadCell[],
  onRequestSort:(property: string) => void,
  inventoryData:InventoryItem[]
  onDeleteEntry?:(id: any) => () => void,
  onUpdateEntry?:(id: any) => (newInfo: InventoryItem) => Promise<void>,
  onAddEntry?:(args: InventoryItem) => Promise<void>,
  itemCount:number,
  categories?:string[],
  itemsPerPage:number,
  onChangeItemsPerPage:(value: number) => void,
  page:number,
  onChangePage:(newPage: number) => void,
  onChangeFilterString:(newFilterString: any) => void,
  order:Order,
  orderBy:string,
  title?:string,
  mutable?:boolean,
  empty?:boolean
};

const SellerTableComponent = ({ 
  headCells, 
  onRequestSort, 
  inventoryData, 
  onDeleteEntry=()=>()=>{}, 
  onUpdateEntry=()=>()=>(new Promise((resolve, reject) => {})),
  onAddEntry=()=>(new Promise((resolve, reject) => {})),
  itemCount,
  categories=[],
  itemsPerPage,
  onChangeItemsPerPage,
  page,
  onChangePage,
  onChangeFilterString,
  order,
  orderBy,
  title="",
  mutable=true,
  empty=false
}:SellerTableProps) => {

  const [newItemDialogOpen, setNewItemDialogOpen] = useState<boolean>(false);

  return (
    <Paper className="generalContainer">
      <div style={{ display: "flex", flexDirection: "row", justifyContent: "center"}}>
        <Typography variant="h4">
          {title}
        </Typography>
      </div>
      <div className="topControls">
        <SellerTableSearchComponent
          label="Filter by name"
          onSubmit={onChangeFilterString}
        />
        <SellerPaginationComponent
          rowsPerPageOptions={[5, 10, 25]}
          count={itemCount}
          rowsPerPage={itemsPerPage}
          page={page}
          label={"Rows per page:"}
          onPageChange={onChangePage}
          onRowsPerPageChange={onChangeItemsPerPage}
        />
        {
          mutable?
          <div>
            <Button variant="outlined" startIcon={<AddIcon/>}
              onClick={() => setNewItemDialogOpen(true)}
            >
              New Item
            </Button>
          </div> :
          null
        }
      </div>
      <InventoryItemDialog
        isOpen={newItemDialogOpen}
        onClose={() => setNewItemDialogOpen(false)}
        onSubmit={(newItem) => {
            setNewItemDialogOpen(false);
            return (onAddEntry != null)? onAddEntry(newItem) : null;
        }}
        categories={categories}
        id={0}
        name={"New item"}
        description={"Description"}
        price={1}
        category={""}
        img_link={"Image link"}
        quantity={1}
        available={false}
      />
      {
        (empty)?
        <Paper style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "20%",
          }}>
          <Typography style={{margin: "10px"}}>
            Use the NEW ITEM button to add an item to your inventory.
          </Typography>
        </Paper> :
        <TableContainer component={Paper} style={{ maxHeight: "60%", width: "95%" }}>
          <Table stickyHeader>
            <EnhancedTableHeadComponent
              headCells={headCells}
              onRequestSort={onRequestSort}
              order={order}
              orderBy={orderBy}
            />
            <TableBody>
              {inventoryData
              .map((item) => (
                <InventoryRowComponent
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  description={item.description}
                  price={item.price}
                  category={item.category}
                  img_link={item.img_link}
                  quantity={item.quantity}
                  available={item.available}
                  onChange={onUpdateEntry(item.id)}
                  onDelete={onDeleteEntry(item.id)}
                  categories={categories}
                  mutable={mutable}
                />
              ))}
          </TableBody>
          </Table>
        </TableContainer>
      }
      
    </Paper>
  )
}

export default SellerTableComponent;