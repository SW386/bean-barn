import React from 'react';
import protectedRoute from '../Utils/ProtectedRoute';
import instance from '../Utils/Axios';
import Typography from '@mui/material/Typography';
import SellerTableComponent from '../Components/Seller/SellerTableComponent';
import { useState, useEffect } from 'react';
import NavbarComponent from '../Components/NavbarComponent';
import { headCells, InventoryItem, InventoryResponse, PopularItemResponse, Order, fetchBestSellers } from '../Utils/SellerUtility';
import Paper from '@material-ui/core/Paper';
import SellerChartComponent from '../Components/Seller/SellerChartComponent';

import './SellerInventoryPage.css'
import SellerLoadingComponent from '../Components/Seller/SellerLoadingComponent';

interface CountResponse {
    count:number
};

const SellerInventoryPage:React.VFC = () => {

    const [inventoryData, setInventory] = useState<InventoryItem[]>([]);
    const [page, setPage] = useState<number>(0);
    const [itemsPerPage, setItemsPerPage] = useState<number>(10);
    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<string>('name');
    const [filterString, setFilterString] = useState<string>('');
    const [categories, setCategories] = useState<string[]>([]);
    const [itemCount, setItemCount] = useState<number>(0);
    const [totalItemCount, setTotalItemCount] = useState<number>(-1);
    const [popularItems, setPopularItems] = useState<PopularItemResponse[]>([]);

    useEffect(() => {
        getInventoryItems();
        getCategories();
        getBestSellers();
    }, []);

    function popularItemsAsList(itemList:PopularItemResponse[]) {
        // if (popularItems.length === 0) { return null; }
        const retList:(string | number)[][] = ([['Product', 'Quantity Sold']]);
        let popularItemData = itemList.map((item) => [item.name, item.quantity]);
        return retList.concat(popularItemData);
    }

    function getCategories() {
        instance.get('/api/category')
        .then((res) => {
            const category_data = res.data as string[];
            setCategories(category_data)
        });
    }

    const getInventoryItems = () => {
        let inventoryParams = {
            sort_criterion: orderBy,
            sort_direction: order,
            num_items: itemsPerPage,
            start_index: (itemsPerPage * page),
            search_term: filterString,
        };
        instance.get(`/api/inventory`, { params: inventoryParams })
        .then((res) => {
            let responseObj = res.data as InventoryResponse;
            setInventory(responseObj.items);
            setItemCount(responseObj.count);
            setTotalItemCount(Math.max(responseObj.count, totalItemCount));
        });
    };

    const getBestSellers = () => {
        fetchBestSellers(5).then(setPopularItems);
    }

    const addInventoryEntry = (args: InventoryItem) => {
        return new Promise<void>((resolve, reject) => {
            instance.post(`/api/inventory_add`, {},{ params: args })
            .then((res) => {
                getInventoryItems();
                getBestSellers();
                alert("Item successfully added.")
                resolve();
            }).catch((err) => {
                console.log(err);
                alert("Unable to add item.")
                reject();
            });
        });
    }

    const deleteInventoryEntry = (id) => () => {
        return new Promise<void>((resolve, reject) => {
            instance.post('/api/inventory_delete', {}, { params: { id: id } })
            .then((res) => {
                getInventoryItems();
                alert("Item successfully discontinued.")
                resolve();
            });
        });
    }

    const updateInventoryEntry= (id) => (newInfo: InventoryItem) => {
        return new Promise<void>((resolve, reject) => {
            instance.post('/api/inventory_update', {}, { params: newInfo })
            .then((res) => {
                getInventoryItems();
                alert("Item successfully updated.")
                getBestSellers();
                resolve();
            })
            .catch((err) => {
                alert("Unable to update item.")
                reject();
            });
        });
    }

    // https://github.com/mui-org/material-ui/blob/v5.0.6/docs/src/pages/components/tables/EnhancedTable.tsx
    const handleChangeItemsPerPage = (value:number) => {
        setItemsPerPage(value);
        setPage(0);
    };

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

    useEffect(() => {
        getInventoryItems();
    }, [order, orderBy, page, itemsPerPage, filterString]);

    const handleChangeFilterString = (newFilterString) => {
        setFilterString(newFilterString);
        setPage(0);
    }
    return(
        <div>
            <NavbarComponent/>
            {
                (totalItemCount < 0)?
                <SellerLoadingComponent/> :
                <div className="mainPage">
                    <Paper className="tableContainer">
                        <SellerTableComponent
                            headCells={headCells}
                            onRequestSort={handleRequestSort}
                            inventoryData={inventoryData}
                            onDeleteEntry={deleteInventoryEntry}
                            onUpdateEntry={updateInventoryEntry}
                            onAddEntry={addInventoryEntry}
                            itemCount={itemCount}
                            categories={categories}
                            itemsPerPage={itemsPerPage}
                            onChangeItemsPerPage={handleChangeItemsPerPage}
                            page={page}
                            onChangePage={handleChangePage}
                            onChangeFilterString={handleChangeFilterString}
                            order={order}
                            orderBy={orderBy}
                            title="What I'm Selling"
                            empty={totalItemCount === 0}
                        />
                    </Paper>
                    <div className="chartComponentContainer">
                        {(totalItemCount === 0 || popularItems.length === 0)?
                            null :
                            <SellerChartComponent
                                popularItems={popularItemsAsList(popularItems)}
                            />
                            
                        }
                    </div>
                </div>
            }
        </div>
        
    )
}

export default protectedRoute(SellerInventoryPage);
