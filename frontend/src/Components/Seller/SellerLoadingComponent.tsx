import { Typography } from '@material-ui/core';

import './SellerLoadingComponent.css';

const SellerLoadingComponent = () => {
  return (
    <div className="loadingContainer">
      <img 
          src="https://thumbs.dreamstime.com/b/green-beans-right-side-ecological-raw-vegetables-over-wood-table-green-beans-wood-table-124712795.jpg"
          alt="Inoffensive green bean themed banner"
          style={{width: "100%"}}
      />
      <div className="loadingCenteredText">
          <Typography variant="h2">Loading your information....</Typography>
      </div>
    </div>
  )
}

export default SellerLoadingComponent;