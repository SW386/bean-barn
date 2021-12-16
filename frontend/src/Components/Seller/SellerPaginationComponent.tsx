import { Icon, IconButton, MenuItem, Select, Typography } from "@material-ui/core";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import './SellerPaginationComponent.css';

const SellerPaginationComponent = ({
  rowsPerPageOptions,
  count,
  rowsPerPage,
  page,
  label,
  onPageChange,
  onRowsPerPageChange
}) => {

  function pageIndicatorText(currentPage:number, itemsPerPage:number, totalItems:number):string {
    const upperBound:number = Math.min((currentPage + 1) * itemsPerPage, totalItems);
    return `${(currentPage * itemsPerPage) + 1}-${upperBound} of ${totalItems}`;
  }

  return (
    <div className="paginationComponent">
      <Typography>{label}</Typography>
      <Select
        value={rowsPerPage}
        onChange={(e) => onRowsPerPageChange(parseInt(e.target.value as string))}
      >
        {
          rowsPerPageOptions.map((option:number) => (
            <MenuItem key={option} value={option}>{option}</MenuItem>
          ))
        }
      </Select>
      <Typography>{pageIndicatorText(page, rowsPerPage, count)}</Typography>
      <IconButton aria-label="Previous page"
        disabled={page === 0}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeftIcon/>
      </IconButton>
      <IconButton aria-label="Next page"
        disabled={page >= (count / rowsPerPage) - 1}
        onClick={() => onPageChange(page + 1)}
      >
        <ChevronRightIcon/>
      </IconButton>
    </div>
  )
};

export default SellerPaginationComponent;