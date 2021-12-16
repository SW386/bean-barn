import React, {useEffect, useState} from 'react';
import instance from "../Utils/Axios";
import { DataGrid, GridRowsProp, GridColDef, GridEditRowsModel, GridCellEditCommitParams} from '@mui/x-data-grid';
import Container from "@mui/material/Container";
import Button from '@mui/material/Button';
import { cpus } from 'os';

interface CreatorSellerReviews {
    review : {
        name : string,
        rating : number,
        review : string,
        date : string,
        user_id : number,
        seller_id : number
    }, 
    email : string,
    review_id : number
}

interface CreatorProductReviews {
    review : {
        name : string, 
        rating :number, 
        review : string,
        date : string, 
        user_id : number,
        product_id : number
    },
    review_id : number
}


var sellerGridRows : GridRowsProp = [];

const sellerGridColumns : GridColDef[] = [
    { field: 'name', headerName: 'Seller Name', editable: false, width:200},
    { field: 'review', headerName: 'Review', editable: true, width:550 },
    { field: 'rating', headerName : 'Rating', type : 'number', editable: true, width:100,
    preProcessEditCellProps: (params: any) => {
        var hasError = false;
        if (params.props.value < 1 || params.props.value > 5) {
            hasError = true
        }
        return { ...params.props, error: hasError };
    }},
    { field: 'date', headerName: 'Date', type: 'date', editable: false, width:300}
]

var productGridRows : GridRowsProp = [];

const productGridColumns : GridColDef[] = [
    { field: 'name', headerName: 'Product Name', editable: false, width:200},
    { field: 'review', headerName: 'Review', editable: true, width:550 },
    { field: 'rating', headerName : 'Rating', type : 'number', editable: true, width:100,
    preProcessEditCellProps: (params: any) => {
        var hasError = false;
        if (params.props.value < 1 || params.props.value > 5) {
            hasError = true
        }
        return { ...params.props, error: hasError };
    }},
    { field: 'date', headerName: 'Date', type: 'date', editable: false, width:300}
]

const AccountReviewComponent : React.VFC = () => {

    const [editProductRowsModel, setEditProductRowsModel] = useState({});
    const [editSellerRowsModel, setEditSellerRowsModel] = useState({});
    const [selectedSellerRows, setSelectedSellerRows] = useState([]);
    const [selectedProductRows, setSelectedProductRows] = useState([]);

    useEffect(() => {
        instance.get('/api/get_own_seller_reviews').then(res => {
            const data = Object.assign({}, res.data)
            if ("reviews" in data) {
                sellerGridRows = data["reviews"].map((p : CreatorSellerReviews) => {
                    return {
                        id : p.review_id, 
                        name : p.review.name, 
                        review : p.review.review,
                        rating : p.review.rating,
                        date : p.review.date
                    }
                })
            }
        }).catch(err => {
            console.log(err)
        })

        instance.get('/api/get_own_product_reviews').then(res => {
            const data = Object.assign({}, res.data)
            if ("reviews" in data) {
                productGridRows = data["reviews"].map((p : CreatorProductReviews) => {
                    return {
                        id : p.review_id,
                        name : p.review.name,
                        review : p.review.review,
                        rating : p.review.rating,
                        date : p.review.date
                    }
                })
            }
        })
    }, [])

    const handleEditProductRowsModelChange = React.useCallback((model: GridEditRowsModel) => {
        setEditProductRowsModel(model)
    }, []);

    const handleEditSellerRowsModelChange = React.useCallback((model: GridEditRowsModel) => {
        setEditSellerRowsModel(model)
    }, []);

    const handleEditCommit = React.useCallback((params: GridCellEditCommitParams) => {
        var data = {
            id : params.id,
            [params.field]: params.value,
        }
        instance.post('/api/modify_reviews', data).catch(err => {
            console.log(err)
        })

    }, [])

    const handleSellerRowSelection = React.useCallback((params) => {
        setSelectedSellerRows(params)
    }, [])


    const handleProductRowSelection = React.useCallback((params) => {
        setSelectedProductRows(params)
    }, [])

    const handleSellerDelete = () => {
        const data = {
            review_ids : selectedSellerRows
        }
        instance.post('/api/delete_reviews', data).catch(err => {
            console.log(err)
        })
        window.location.reload();
    }

    const handleProductDelete = () => {
        const data = {
            review_ids : selectedProductRows
        }
        console.log(data)
        instance.post('/api/delete_reviews', data).catch(err => {
            console.log(err)
        })
        window.location.reload();
    }

    return(<Container>
        <div style={{marginTop:"5em", marginBottom:"5em"}}>
        <h2 style={{textAlign:"center"}}>Your Seller Reviews</h2>
        <h4 style={{textAlign:"center"}}>To edit a review, double click the review contents.</h4>
        <div style={{height : 300, width:'100%', textAlign:"center"}}>
            <DataGrid 
            rows={sellerGridRows} 
            columns={sellerGridColumns}
            editRowsModel={editSellerRowsModel}
            onEditRowsModelChange={handleEditSellerRowsModelChange} 
            onCellEditCommit={handleEditCommit}
            checkboxSelection
            onSelectionModelChange={handleSellerRowSelection}
            />
            
            <Button variant="contained" color="primary" onClick={handleSellerDelete}>Delete</Button>
        </div>
        </div>
        <div style={{marginTop:"5em", marginBottom:"5em"}}>
        <h2 style={{textAlign:"center"}}>Your Product Reviews</h2>
        <h4 style={{textAlign:"center"}}>To edit a review, double click the review contents.</h4>
        <div style={{height : 300, width:'100%', textAlign:"center"}}>
            <DataGrid 
            rows={productGridRows} 
            columns={productGridColumns}
            editRowsModel={editProductRowsModel}
            onEditRowsModelChange={handleEditProductRowsModelChange} 
            onCellEditCommit={handleEditCommit}
            checkboxSelection
            onSelectionModelChange={handleProductRowSelection}/>
            <Button variant="contained" color="primary" onClick={handleProductDelete}>Delete</Button>
        </div>
        </div>

    </Container>)

}

export default AccountReviewComponent