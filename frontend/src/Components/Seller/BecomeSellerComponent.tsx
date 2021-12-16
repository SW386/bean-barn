import { Button } from "@material-ui/core";
import { Typography } from "@material-ui/core";
import { Paper } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import instance from "../../Utils/Axios";

import './BecomeSellerComponent.css'

interface BecomeSellerResponse {
  success:boolean;
};

const BecomeSellerComponent = () => {

  const history = useHistory();

  const handleBecomeSeller = () => {
    instance.post('/api/become_seller')
    .then((res) => {
      const data = res.data as BecomeSellerResponse;
      if (data.success) {
        history.push('/seller_inventory');
      }
    });
  }

  return (
    <div className="becomeSellerContainer">
      <Paper className="blurbContainer">
        <div className="beansQuestionContainer">
          <Typography>Got beans? Sell them here!</Typography>
        </div>
        <div className="becomeSellerButtonContainer">
          <Button 
            variant="contained"
            onClick={handleBecomeSeller}
          >
            Become a seller
          </Button>
        </div>
      </Paper>
    </div>
  )
}

export default BecomeSellerComponent;