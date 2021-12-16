import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import TableFooter from '@mui/material/TableFooter';
import Paper from '@mui/material/Paper';
import NavbarComponent from '../NavbarComponent';


interface SellerReviewProps {
    reviews: Review[]
}

interface Review {
    name: string
    text: string
    rating: number
}

const SellerReviewsComponent = ({ reviews }: SellerReviewProps) => {
    const [page, setPage] = React.useState(0)
    const [rowsPerPage, setRowsPerPage] = React.useState(5)

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
    };

    const handleChangePage = (event, newPage: number) => {
        setPage(newPage)
    }

    return(
        <div>   
            <NavbarComponent/>
            <div>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Buyer</TableCell>
                                <TableCell>Review</TableCell>
                                <TableCell>Rating</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {reviews.slice(page*rowsPerPage, (page+1)*rowsPerPage).map((row: Review, i) => (
                                <TableRow>
                                    <TableCell>{row.name}</TableCell>
                                    <TableCell>{row.text}</TableCell>
                                    <TableCell>{row.rating}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 20]}
                                rowsPerPage={rowsPerPage}
                                colSpan={3}
                                page={page}
                                count={reviews.length}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </TableFooter>
                    </Table>
                </TableContainer>
            </div>
        </div>
    )
}

export default SellerReviewsComponent;