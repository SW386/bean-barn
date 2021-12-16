import { useEffect, useState } from 'react';
import { Order, InventoryItem, HeadCell, headCells, InventoryQueryParams, InventoryResponse } from '../../Utils/SellerUtility'
import SellerTableComponent from "./SellerTableComponent";

interface UncontrolledSellerTableProps {
  tableHeadCells?:HeadCell[];
  title?:string;
  mutable?:boolean;
  categories?:string[];
  getInventoryItemsCallback:(queryParams: InventoryQueryParams) => Promise<InventoryResponse>;
  addInventoryItemCallback?:(args: InventoryItem) => Promise<void>;
  deleteInventoryItemCallback?:(id:number) => Promise<void>;
  updateInventoryItemCallback?:(newInfo: InventoryItem) => Promise<void>;
};

const UncontrolledSellerTableComponent = ({
  tableHeadCells=headCells,
  title="",
  categories=[],
  getInventoryItemsCallback,
  mutable=false,
  addInventoryItemCallback=()=>new Promise(()=>{}),
  deleteInventoryItemCallback=()=>new Promise(() => {}),
  updateInventoryItemCallback=()=>new Promise(() => {}),
}: UncontrolledSellerTableProps) => {

  const [inventoryData, setInventory] = useState<InventoryItem[]>([]);
  const [page, setPage] = useState<number>(0);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<string>('name');
  const [filterString, setFilterString] = useState<string>('');
  const [itemCount, setItemCount] = useState<number>(0);

  useEffect(() => {
    updateInventoryContents();
  }, []);  
  
  useEffect(() => {
    updateInventoryContents();
  }, [order, orderBy, page, itemsPerPage, filterString]);

  function updateInventoryContents() {
    getInventoryItemsCallback(getInventoryQueryParams())
    .then((inventoryResponse) => {
      setInventory(inventoryResponse.items);
      setItemCount(inventoryResponse.count);
    })
  }

  function getInventoryQueryParams():InventoryQueryParams {
    return {
      sort_criterion: orderBy,
      sort_direction: order,
      num_items: itemsPerPage,
      start_index: (itemsPerPage * page),
      search_term: filterString,
    }
  }

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  const handleRequestSort = (property: string) => {
      let a = (orderBy === property)
      let b = (order === 'asc') 
      let c:Order = (a && b)? 'desc' : 'asc';
      setOrder(c);
      setOrderBy(property);
  };

  const handleChangeFilterString = (newFilterString) => {
    setFilterString(newFilterString);
    setPage(0);
  };

  const handleChangeItemsPerPage = (value:number) => {
    setItemsPerPage(value);
    setPage(0);
  };

  const addInventoryEntry = (args: InventoryItem) => {
    return new Promise<void>((resolve, reject) => {
        addInventoryItemCallback(args)
        .then((res) => {
            resolve();
        }).catch((err) => {
            console.log(err);
            reject();
        });
    });
  };

  const deleteInventoryEntry = (id) => () => {
      deleteInventoryItemCallback(id)
      .then((res) => {
          getInventoryItemsCallback(getInventoryQueryParams())
      });
  };

  const updateInventoryEntry= (id) => (newInfo: InventoryItem) => {
      return new Promise<void>((resolve, reject) => {
        updateInventoryItemCallback(newInfo)
          .then((res) => {
            getInventoryItemsCallback(getInventoryQueryParams())
            resolve();
          })
          .catch((err) => {
              if (err.response && err.response.status === 400) {
                  console.log("Failed to update inventory.")
              }
              reject();
          });
      });
  }

  return (
    <SellerTableComponent
      headCells={tableHeadCells}
      onRequestSort={handleRequestSort}
      inventoryData={inventoryData}
      onDeleteEntry={deleteInventoryEntry}
      onAddEntry={addInventoryEntry}
      onUpdateEntry={updateInventoryEntry}
      itemCount={itemCount}
      categories={categories}
      itemsPerPage={itemsPerPage}
      onChangeItemsPerPage={handleChangeItemsPerPage}
      page={page}
      onChangePage={handleChangePage}
      onChangeFilterString={handleChangeFilterString}
      order={order}
      orderBy={orderBy}
      mutable={mutable}
      title={title}
    />      
  )
}

export default UncontrolledSellerTableComponent;