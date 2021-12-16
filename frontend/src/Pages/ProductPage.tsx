import React, { useState, useEffect } from "react";
import ProductlstComp from "../Components/ProductlstComp";
import { TextField, Box } from "@material-ui/core";
import instance from "../Utils/Axios";
import Grid from "@mui/material/Grid";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import Chip from "@mui/material/Chip";
import NavbarComponent from "../Components/NavbarComponent";
import Pagination from "@mui/material/Pagination";

interface Product {
  id: number;
  seller_id: number;
  quantity: number;
  name: string;
  price: number;
  description: string;
  img_link: string;
  category: string;
  available: boolean;
  rating: number;
}
interface CountResponse {
  count: number;
}

const ProductPage: React.VFC = () => {
  const [data, setData] = useState<Product[]>([]);
  const [category, setCategory] = useState([]);
  const [searchfilter, setSearchfilter] = useState("");
  const [page, setPage] = React.useState(1);
  const [itemsperpage] = useState<number>(15);
  const [productCount, SetProductCount] = useState<number>(0);
  const [totalproductCount, SettotalproductCount] = useState<number>(0);
  const [keyword, setkeyword] = useState("");
  const [sort, setSort] = useState("all");

  const handlePage = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    //console.log(sort, searchfilter);
    instance
      .get("/get_product", {
        params: {
          sort: sort,
          searchfilter: searchfilter,
          perpage: itemsperpage,
          offset: (value - 1) * itemsperpage,
        },
      })
      .then((res) => {
        const data = Object.assign({}, res.data);
        if ("product" in data) {
          setData(data["product"]);
        }
      });
  };

  const pricesortup = () => {
    setPage(1);
    setSort("priceup");
    setSearchfilter("all");
    SetProductCount(totalproductCount);
    

    instance
      .get("/get_product", {
        params: {
          sort: "priceup",
          seachfitler: "all",
          perpage: itemsperpage,
          offset: 0,
        },
      })
      .then((res) => {
        const data = Object.assign({}, res.data);
        if ("product" in data) {
          setData(data["product"]);
        }
      });
  };

  const pricesortdown = () => {
    setPage(1);
    setSort("pricedown");
    setSearchfilter("all");
    SetProductCount(totalproductCount);

    instance
      .get("/get_product", {
        params: {
          sort: "pricedown",
          seachfitler: "all",
          perpage: itemsperpage,
          offset: 0,
        },
      })
      .then((res) => {
        const data = Object.assign({}, res.data);
        if ("product" in data) {
          setData(data["product"]);
        }
      });
  };

  const namesortdown = () => {
    setPage(1);
    setSort("namedown");
    setSearchfilter("all");
    SetProductCount(totalproductCount);
    instance
      .get("/get_product", {
        params: {
          sort: "namedown",
          seachfitler: "all",
          perpage: itemsperpage,
          offset: 0,
        },
      })
      .then((res) => {
        const data = Object.assign({}, res.data);
        if ("product" in data) {
          setData(data["product"]);
        }
      });
  };

  const namesortup = () => {
    setPage(1);
    setSort("nameup");
    setSearchfilter("all");
    SetProductCount(totalproductCount);
    instance
      .get("/get_product", {
        params: {
          sort: "nameup",
          seachfitler: "all",
          perpage: itemsperpage,
          offset: 0,
        },
      })
      .then((res) => {
        const data = Object.assign({}, res.data);
        if ("product" in data) {
          setData(data["product"]);
        }
      });
  };

  const reviewsortup = () => {
    setPage(1);
    setSort("reviewup");
    setSearchfilter("all");
    SetProductCount(totalproductCount);
    instance
      .get("/get_product", {
        params: {
          sort: "reviewup",
          seachfitler: "all",
          perpage: itemsperpage,
          offset: 0,
        },
      })
      .then((res) => {
        const data = Object.assign({}, res.data);
        if ("product" in data) {
          setData(data["product"]);
        }
      });
  };

  const reviewsortdown = () => {
    setPage(1);
    setSort("reviewdown");
    setSearchfilter("all");
    SetProductCount(totalproductCount);
    instance
      .get("/get_product", {
        params: {
          sort: "reviewdown",
          seachfitler: "all",
          perpage: itemsperpage,
          offset: 0,
        },
      })
      .then((res) => {
        const data = Object.assign({}, res.data);
        if ("product" in data) {
          setData(data["product"]);
        }
      });
  };

  const purchasesortdown = () => {
    setPage(1);
    setSort("purchasedown");
    setSearchfilter("all");
    SetProductCount(totalproductCount);
    instance
      .get("/get_product", {
        params: {
          sort: "purchasedown",
          seachfitler: "all",
          perpage: itemsperpage,
          offset: 0,
        },
      })
      .then((res) => {
        const data = Object.assign({}, res.data);
        if ("product" in data) {
          setData(data["product"]);
        }
      });
  };

  const purchasesortup = () => {
    setPage(1);
    setSort("purchaseup");
    setSearchfilter("all");
    SetProductCount(totalproductCount);
    instance  
      .get("/get_product", {
        params: {
          sort: "purchaseup",
          seachfitler: "all",
          perpage: itemsperpage,
          offset: 0,
        },
      })
      .then((res) => {
        const data = Object.assign({}, res.data);
        if ("product" in data) {
          setData(data["product"]);
        }
      });
  };

  const handleChange = (event) => {
    setkeyword(event.target.value);
    //console.log(keyword)
  };
  const keyPress = (event) => {
    if (event.keyCode == 13) {
      setkeyword(event.target.value);
      //console.log(keyword);
      setPage(1);
      setSort("search");
      setSearchfilter(keyword);

      instance
        .get("/product_count", {
          params: { sort: "search", searchfilter: keyword },
        })
        .then((res) => {
          let count_info = res.data as CountResponse;
          SetProductCount(count_info.count);
        });

      instance
        .get("/get_product", {
          params: {
            sort: "search",
            searchfilter: keyword,
            perpage: itemsperpage,
            offset: 0,
          },
        })
        .then((res) => {
          //console.log(cat);
          const data = Object.assign({}, res.data);
          if ("product" in data) {
            setData(data["product"]);
            //console.log(data["product"])
          }
        });
    }
  };

  const sortbycat = (cat) => {
    //console.log(cat);
    setPage(1);
    setSort("cat");
    setSearchfilter(cat);
    instance
      .get("/product_count", {
        params: { sort: "cat", searchfilter: cat },
      })
      .then((res) => {
        //console.log(res.data)
        let count_info = res.data as CountResponse;
        SetProductCount(count_info.count);
      });

    instance
      .get("/get_product", {
        params: {
          sort: "cat",
          searchfilter: cat,
          perpage: itemsperpage,
          offset: 0,
        },
      })
      .then((res) => {
        //console.log(cat);
        const data = Object.assign({}, res.data);
        if ("product" in data) {
          setData(data["product"]);
          //console.log(data["product"])
        }
      });
  };

  useEffect(() => {
    instance
      .get("/get_product", {
        params: {
          sort: "all",
          perpage: itemsperpage,
          offset: (page - 1) * itemsperpage,
        },
      })
      .then((res) => {
        const data = Object.assign({}, res.data);
        if ("product" in data) {
          setData(data["product"]);
        }
      });

    instance
      .get("/product_count", {
        params: { sort: "all", searchfilter: "None" },
      })
      .then((res) => {
        //console.log(res.data)
        let count_info = res.data as CountResponse;
        SetProductCount(count_info.count);
        SettotalproductCount(count_info.count)
      });

    instance.get("/getcat").then((res) => {
      //console.log("cat");
      console.log(res.data);
      const cat = Object.assign([], res.data);
      setCategory(cat);
      //console.log(cat);
    });
  }, []);

  const drawerWidth = 350;

  return (
    <div>
      <NavbarComponent />

      <Box sx={{ display: "flex" }}>
        <CssBaseline />

        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              top: 64,
              boxSizing: "border-box",
            },
          }}
          variant="permanent"
          anchor="left"
        >
          <Box p={2} style={{ paddingBottom: "70px" }}>
            <TextField
              label="Search"
              variant="filled"
              onKeyDown={keyPress}
              onChange={handleChange}
              name="Search"
              style={{ width: "100%" }}
            />

            <Divider />
            <Typography variant="subtitle1">Sort Price</Typography>
            <List>
              <ListItem button onClick={pricesortup}>
                Lowest to Highest
              </ListItem>
              <ListItem button onClick={pricesortdown}>
                Highest to Lowest
              </ListItem>
            </List>
            <Divider />
            <Typography variant="subtitle1">Sort Popular</Typography>
            <List>
              <ListItem button onClick={purchasesortdown}>
                Most Purchased
              </ListItem>
              <ListItem button onClick={purchasesortup}>
                Least Purchased
              </ListItem>
            </List>
            <Divider />
            <Typography variant="subtitle1">Sort Review</Typography>
            <List>
              <ListItem button onClick={reviewsortdown}>
                Highest to Lowest
              </ListItem>
              <ListItem button onClick={reviewsortup}>
                Lowest to Highest
              </ListItem>
            </List>
            <Divider />
            <Typography variant="subtitle1">Sort Name</Typography>
            <List>
              <ListItem button onClick={namesortup}>
                Alphabetical
              </ListItem>
              <ListItem button onClick={namesortdown}>
                Reverse Aphabetical
              </ListItem>
            </List>
            <Divider />

            <Typography variant="subtitle1">Categories</Typography>
            {category.map((category) => {
              return (
                <Chip
                  //icon={icon}
                  variant="outlined"
                  sx={{ m: 0.5 }}
                  onClick={() => sortbycat(category)}
                  label={category}
                  //onDelete={data.label === 'React' ? undefined : handleDelete(data)}
                />
              );
            })}
          </Box>
        </Drawer>

        <Box
          component="main"
          sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}
        >
          <Toolbar />
          <ProductlstComp product={data} />

          <Grid container justifyContent="center">
            <Pagination
              count={Math.ceil(productCount / itemsperpage)}
              shape="rounded"
              onChange={handlePage}
              page={page}
            />
          </Grid>
        </Box>
      </Box>
    </div>
  );
};

export default ProductPage;
