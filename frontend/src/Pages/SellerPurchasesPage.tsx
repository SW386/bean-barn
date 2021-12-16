import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableFooter from '@mui/material/TableFooter';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import protectedRoute from '../Utils/ProtectedRoute';
import instance from '../Utils/Axios';
import PurchaseRowComponent from '../Components/Seller/PurchaseRowComponent';
import EnhancedTableHeadComponent from '../Components/Seller/EnhancedTableHeadComponent';
import TablePagination from '@mui/material/TablePagination';
import { Chart } from "react-google-charts";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";

import { useState, useEffect } from 'react';
import NavbarComponent from '../Components/NavbarComponent';
import { Purchase, PurchaseResponse, Order, fetchBestSellers } from '../Utils/SellerUtility';

import './SellerPurchasesPage.css'
import PurchasePlaceholderComponent from '../Components/Seller/PurchasePlaceholderComponent';
import PurchaseLoadingComponent from '../Components/Seller/SellerLoadingComponent';


interface SalesPerMonth {
    year:number,
    month:number,
    sales:number
};

interface SalesOverTimeResponse {
    id:number,
    name:string,
    salesOverTime: SalesPerMonth[]
};


const headCells=[
    {
        id: 'firstname',
        label: 'Buyer',
        ordered: true,
        numeric: false
    },
    {
        id: 'address',
        label: 'Address',
        ordered: false,
        numeric: false
    },
    {
        id: 'name',
        label: 'Product',
        ordered: true,
        numeric: false
    },
    {
        id: 'quantity',
        label: 'Quantity',
        ordered: true,
        numeric: true
    },
    {
        id: 'time_purchased',
        label: 'Purchase Time',
        ordered: true,
        numeric: false
    },
    {
        id: 'fulfillment_status',
        label: 'Fulfillment',
        ordered: true,
        numeric: false
    }
];

const SellerPurchasesPage:React.VFC = () => {

    const [purchaseData, setPurchaseData] = useState<Purchase[]>([]);
    const [order, setOrder] = useState<Order>('desc');
    const [orderBy, setOrderBy] = useState<string>('buyer');
    const [itemsPerPage, setItemsPerPage] = useState<number>(5);
    const [itemCount ,setItemCount] = useState<number>(0);
    const [totalItemCount, setTotalItemCount] = useState<number>(-1);
    const [page, setPage] = useState<number>(0);
    const [salesData, setSalesData] = useState<object>({ });
    const [startDate, setStartDate] = useState({ year: 2020, month: 1 });
    const [numMostPopular, setNumMostPopular] = useState<number>(4);

    useEffect(() => {
        getPurchases();
        fetchBestSellers(numMostPopular)
        .then((topSellerData) => {
            topSellerData.forEach(({ productID }) => getSalesData(productID, startDate));
        });
    }, []);

    useEffect(() => {
       getPurchases();
    }, [order, orderBy, page, itemsPerPage]);

    function fetchPurchasesOrderedPaginated(sortBy:string, sortDirection:string, numItems:number, offset:number):Promise<PurchaseResponse> {
        return new Promise<PurchaseResponse>((resolve, reject) => {
            instance.get('/api/seller_purchases', { params: {
                sort_criterion: sortBy,
                sort_direction: sortDirection,
                num_items: numItems,
                offset_amount: offset,
            }})
            .then((res) => resolve(res.data as PurchaseResponse));
        })
    }

    function getPurchases() {
        fetchPurchasesOrderedPaginated(orderBy, order, itemsPerPage, page * itemsPerPage)
        .then(({ count, purchases }) => {
            setTotalItemCount(Math.max(totalItemCount, count));
            setPurchaseData(purchases);
            setItemCount(count);
        });
    }

    const handleFulfillmentChange = (orderId:number, productId:number) => (newStatus:string) => {
        instance.post('/api/seller_purchases', {}, {params: { 
            order_id: orderId,
            product_id: productId,
            fulfillment_status: newStatus
        } })
        .then(getPurchases);
    }

    function indexFromDate(year:number, month:number, startYear:number, startMonth: number) {
        return ((year * 12) + month) - ((startYear * 12) + startMonth);
    }

    function getSalesData(productId, currentStartDate) {
        instance.get(`/api/sales_over_time`, { params: { product_id: productId }})
        .then((res) => {
            let data = res.data as SalesOverTimeResponse;   

            let salesList:number[] = [];
            forEachMonth(new Date(currentStartDate.year, currentStartDate.month), new Date(), (date, index) => {
                salesList.push(0);
            });
            for (let sale of data.salesOverTime) {
                const i = indexFromDate(sale.year, sale.month, currentStartDate.year, currentStartDate.month);
                if (i < 0) { continue; }
                salesList[i] = sale.sales;
            }
            salesData[data.id] = { name: data.name, sales: salesList };         
            setSalesData({...salesData});
        });
    }

    function getSalesDataPromise(productId, currentStartDate) {
        return new Promise<object>((resolve, reject) => {
            instance.get(`/api/sales_over_time`, { params: { product_id: productId }})
            .then((res) => {
                let data = res.data as SalesOverTimeResponse;   

                let salesList:number[] = [];
                forEachMonth(new Date(currentStartDate.year, currentStartDate.month), new Date(), (date, index) => {
                    salesList.push(0);
                });
                for (let sale of data.salesOverTime) {
                    const i = indexFromDate(sale.year, sale.month, currentStartDate.year, currentStartDate.month);
                    if (i < 0) { continue; }
                    salesList[i] = sale.sales;
                }
                resolve({ name: data.name, sales: salesList });
            });
        });
    }

    function getPurchaseTableRows() {
        return (
            purchaseData
            .map((purchase) => 
                <PurchaseRowComponent 
                    key={`order=${purchase.orderId}, product=${purchase.productId}`}
                    buyerName={`${purchase.firstName} ${purchase.lastName}`}
                    buyerEmail={purchase.email}
                    buyerAddress={`${purchase.streetAddress} ${purchase.city} ${purchase.state} ${purchase.zip}`}
                    productName={purchase.productName}
                    quantity={purchase.quantity}
                    timePurchased={purchase.timePurchased}
                    fulfillment={purchase.fulfillmentStatus}
                    onFulfillmentChange={handleFulfillmentChange(purchase.orderId, purchase.productId)}
                />
            )
        );
    }

    const handleRequestSort = (property: string) => {
        let a = (orderBy === property)
        let b = (order === 'asc') 
        let c: Order = (a && b)? 'desc' : 'asc';
        setOrder(c);
        setOrderBy(property);
    };

    // https://github.com/mui-org/material-ui/blob/v5.0.6/docs/src/pages/components/tables/EnhancedTable.tsx
    const handleChangeItemsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setItemsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    function salesDataFormattedList(startYear:number, startMonth:number, data) {
        const headerList = [salesDataHeader()];
        const salesDataList = salesDataAsList(startYear, startMonth, data);
        const retList = headerList.concat(salesDataList);
        return retList;
    }

    function forEachMonth(startDate:Date, endDate:Date, callback:(date:Date, index:number) => void) {
        let index:number = 0;
        for (let date = new Date(startDate); date < endDate; date.setMonth(date.getMonth() + 1)) {
            callback(new Date(date), index);
            index++;
        }
    }

    function salesDataAsList(startYear:number, startMonth:number, data) {
        const retList:(Date | number)[][] = [];
        forEachMonth(new Date(startYear, startMonth), new Date(), (date, index) => {
            const currRow = [date];
            for (const productSales of Object.keys(data).map((key) => data[key].sales)) {
                currRow.push(productSales[index]);
            }
            retList.push(currRow);
        });
        return retList;
    }

    function salesDataHeader():(object | string | number)[] {
        let retList = [{ type: 'date', label: 'Month'}]
        for (let productId of Object.keys(salesData)) {
            retList.push(salesData[productId].name)
        }
        return retList;
    }
    
    const batchUpdateSalesData = (newNumMostPopular, newStartDate) => {
        fetchBestSellers(newNumMostPopular)
        .then((topSellerData) => {
            const promises:Promise<object>[] = [];
            const currentSalesData = { };
            for (let item of topSellerData) {
                const currentPromise = getSalesDataPromise(item.productID, newStartDate);
                currentPromise.then((salesData) => {
                    currentSalesData[item.productID] = salesData;
                });
                promises.push(currentPromise);
            }
            Promise.all(promises).then(() => setSalesData(currentSalesData));
        });
    }

    return (
        <div>
            <NavbarComponent />
            <div className="SellerPurchasesPage">
            {
                (totalItemCount > 0)?
                <div>
                {
                    (salesData)?
                    <Paper className="chartContainer">
                        <div className="chartControlsContainer">
                        <TextField
                            type="number"
                            label="Start Year"
                            value={startDate.year}
                            onChange={(e) => {
                                const newStartDate = { year: parseInt(e.target.value), month: 0 }; 
                                if (newStartDate.year < 2010 || newStartDate.year > 2021) { return; }
                                setStartDate(newStartDate);
                                batchUpdateSalesData(numMostPopular, newStartDate);
                            }}
                        />
                        <TextField
                            type="number"
                            label="# Most Popular"
                            value={numMostPopular}
                            onChange={(e) => {
                                const newNumMostPopular = parseInt(e.target.value); 
                                if (newNumMostPopular < 1 || newNumMostPopular > 5) { return; }
                                setNumMostPopular(newNumMostPopular);
                                batchUpdateSalesData(newNumMostPopular, startDate);
                            }}
                        />
                        </div>
                        <div>
                        <Chart
                            width={'100%'}
                            height={'100%'}
                            chartType="LineChart"
                            loader={<div>Loading Chart</div>}
                            data={salesDataFormattedList(startDate.year, startDate.month, salesData)}
                            options={{
                            hAxis: {
                                title: 'Time',
                            },
                            vAxis: {
                                title: 'Sales',
                            },
                            }}
                        /> 
                        </div>
                    </Paper>: null
                }
                <TableContainer>
                    <Table>
                        <EnhancedTableHeadComponent
                            headCells={headCells}
                            onRequestSort={handleRequestSort}
                            order={order}
                            orderBy={orderBy}
    
                        />
                        <TableBody>
                            {getPurchaseTableRows()}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                colSpan={3}
                                count={itemCount}
                                rowsPerPage={itemsPerPage}
                                page={page}
                                SelectProps={{
                                    inputProps: {
                                    'aria-label': 'rows per page',
                                    },
                                    native: true,
                                }}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeItemsPerPage}
                                />
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
                </div> :
                (totalItemCount === 0)?
                    <PurchasePlaceholderComponent/> :
                    <PurchaseLoadingComponent/>
            }
            </div>
        </div>
    )
}

export default protectedRoute(SellerPurchasesPage);