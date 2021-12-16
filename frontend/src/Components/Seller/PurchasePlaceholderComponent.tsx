import { Typography } from '@material-ui/core';

import './PurchasePlaceholderComponent.css';

const PurchasePlaceholderComponent = () => {
  return (
    <div className="noPurchasesPlaceholder">
      <img 
          src="https://thumbs.dreamstime.com/b/green-beans-right-side-ecological-raw-vegetables-over-wood-table-green-beans-wood-table-124712795.jpg"
          alt="Inoffensive green bean themed banner"
          style={{width: "100%"}}
      />
      <div className="placeholderCenteredText">
          <Typography variant="h2">No purchases yet.</Typography>
          <Typography variant="h4">Let's face it. Nobody is going to buy your products.</Typography>
      </div>
    </div>
  )
}

export default PurchasePlaceholderComponent;