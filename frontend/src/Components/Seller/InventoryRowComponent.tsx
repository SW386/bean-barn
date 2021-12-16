import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import IconButton from '@mui/material/IconButton';
import InventoryItemDialog from './InventoryItemDialog'
import { useState } from 'react';
import ProductImageComponent from './ProductImageComponent';
import { Link } from "react-router-dom";


const DEFAULT_PRODUCT_IMAGE = "https://solidstarts.com/wp-content/uploads/Green-Bean-scaled.jpg";

const InventoryRowComponent = ({ 
    id,
    name, 
    description, 
    price, 
    category, 
    img_link, 
    available, 
    quantity, 
    onChange, 
    onDelete,
    categories,
    mutable=true
}) => {
    const [dialogOpen, setDialogOpen] = useState<boolean>(false)

    return (
        <TableRow
            key={name}
        >
            <TableCell>
                <Link to={{pathname: `/EachPage/${id}`}} style={{ textDecoration: "none" }}>
                    {name}
                </Link>

            </TableCell>
            <TableCell>
                {category}
            </TableCell>
            <TableCell>
                {(description.length > 50)?
                    description.substring(0, 50) + "..." :
                    description
                }
            </TableCell>
            <TableCell>
                <ProductImageComponent 
                    imageSource={img_link} 
                    fallbackSource={DEFAULT_PRODUCT_IMAGE}
                />
            </TableCell>
            <TableCell align="right">
                {price}
            </TableCell>
            <TableCell align="right">
                {quantity}
            </TableCell>
            <TableCell>
                {available? "Yes" : "No"}
            </TableCell>
            {
                mutable?
                    <TableCell>
                    <IconButton
                        onClick={() => setDialogOpen(true)}>
                        <EditIcon/>
                    </IconButton>
                    <InventoryItemDialog
                        isOpen={dialogOpen}
                        onClose={()=>setDialogOpen(false)}
                        onSubmit={(newInfo) => {
                            setDialogOpen(false);
                            return onChange(newInfo);
                        }}
                        categories={categories}
                        id={id}
                        name={name}
                        description={description}
                        price={price}
                        category={category}
                        img_link={img_link}
                        quantity={quantity}
                        available={available}
                    />
                    </TableCell> :
                    null
            }
            {
                mutable?
                    <TableCell>
                        <IconButton
                            onClick={onDelete}>
                            <DeleteForeverIcon/>
                        </IconButton>
                    </TableCell> :
                    null
            }
        </TableRow>
    );
};

export default InventoryRowComponent;