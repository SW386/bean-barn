import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import { Button, Select, Typography } from '@material-ui/core';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react';

import './InventoryItemDialog.css'
import ProductImageComponent from './ProductImageComponent';

const InventoryItemDialog = ({ 
    isOpen, 
    onClose, 
    onSubmit,
    categories, 
    name, 
    id,
    quantity,
    price,
    description,
    img_link,
    category,
    available, 
}) => {
    const [newName, setName] = useState<string>(name);
    const [newQuantity, setQuantity] = useState<number>(quantity);
    const [newPrice, setPrice] = useState<number>(price);
    const [newDescription, setDescription] = useState<string>(description);
    const [newImg_link, setImg_link] = useState<string>(img_link);
    const [newCategory, setCategory] = useState<string>(category);
    const [newAvailable, setAvailable] = useState<boolean>(available);

    const handleSubmitSelf = () => {
        onSubmit({
            id: id,
            quantity: newQuantity, 
            name: newName,
            price: newPrice,
            description: newDescription,
            img_link: newImg_link,
            category: newCategory,
            available: newAvailable,
        })
        .then(() => {
            setName(name);
            setQuantity(quantity);
            setPrice(price);
            setDescription(description);
            setImg_link(img_link);
            setCategory(category);
            setAvailable(available);
        });
    }

    return (
        <div>
            <Dialog onClose={onClose} open={isOpen}>
                <div className="itemDialog">
                    <div className="nameRow">
                        <TextField
                            value={newName}
                            onChange={(e) => setName(e.target.value)}
                            label="Product name"
                        />
                    </div>
                    <TextField
                        value={newImg_link}
                        onChange={(e) => setImg_link(e.target.value)}
                        label="Image Link"
                    />
                    <div style={{display:"flex", flexDirection:"row", justifyContent:"center", width:"60%", height:"30%"}}>
                        <ProductImageComponent 
                            imageSource={newImg_link} 
                            fallbackSource="https://solidstarts.com/wp-content/uploads/Green-Bean-scaled.jpg"
                        />
                    </div>
                    <div className="priceQuantityRow">
                        <TextField
                            type="number"
                            value={newQuantity}
                            onChange={(e) => setQuantity(Math.max(0, parseInt(e.target.value)))}
                            label="Quantity"
                        />
                        <TextField
                            type="number"
                            value={newPrice}
                            onChange={(e) => setPrice(Math.max(0, parseFloat(e.target.value)))}
                            label="Price"
                        />
                    </div>
                    <TextField
                        value={newDescription}
                        onChange={(e) => setDescription(e.target.value)}
                        label="Description"
                    />
                    <div className="categoryRow">
                        <Typography>
                            Category:
                        </Typography>
                        <Select
                            value={newCategory}
                            onChange={(e) => setCategory(e.target.value as string)}
                        >
                            {
                                categories.map((categoryName) => 
                                    <MenuItem 
                                        key={categoryName}
                                        value={categoryName}>
                                        {categoryName}
                                    </MenuItem>
                                )
                            }
                        </Select>
                    </div>
                    
                    <div className="availableRow">
                        <Typography>
                            Available for purchase:
                        </Typography>
                        <Checkbox
                            checked={newAvailable}
                            onChange={() => {setAvailable(!newAvailable)}}
                        />
                    </div>
                    <div className="submitButtonContainer">
                        <Button
                            disabled={newCategory === ''}
                            onClick={handleSubmitSelf}
                        >
                            Submit
                        </Button>
                    </div>
                    
                </div>
            </Dialog>
        </div>
    )
}

export default InventoryItemDialog;
