import instance from './Axios';

export interface PopularItemResponse {
    name:string,
    quantity:number
    productID:number
}

export interface Purchase {
    firstName:string;
    lastName:string;
    email:string;
    quantity:number; 
    fulfillmentStatus:string;
    orderId:number;
    productImgLink:string;
    productName:string;
    productId:number;
    timePurchased:string;    
    streetAddress:string;
    city:string;
    state:string;
    zip:number;
};

export interface PurchaseResponse {
    count:number,
    purchases:Purchase[]
};

export type Order = 'asc' | 'desc';

export function fetchBestSellers(numBestSellers:number):Promise<PopularItemResponse[]> {
  return new Promise<PopularItemResponse[]>((resolve, reject) => {
      instance.get('/api/bestsellers', { params: { num_bestsellers: numBestSellers }})
      .then((res) => {
          resolve(res.data as PopularItemResponse[]);
      });
  });
}

export interface InventoryItem {
    id:number;
    quantity:number; 
    name: string;
    price: number;
    description: string;
    img_link:string;
    category: string;
    available: boolean;
};

export interface InventoryResponse {
    items:InventoryItem[];
    count:number;
};

export interface HeadCell {
    id: string,
    label: string,
    ordered: boolean,
    numeric: boolean
};

export interface InventoryQueryParams {
    sort_criterion:string,
    sort_direction:Order,
    num_items:number,
    start_index:number,
    search_term:string,
};


export const headCells=[
    {
        id: 'name',
        label: 'Name',
        ordered: true,
        numeric: false
    },
    {
        id: 'category',
        label: 'Category',
        ordered: true,
        numeric: false
    },
    {
        id: 'description',
        label: 'Description',
        ordered: false,
        numeric: false
    },
    {
        id: 'imgLink',
        label: 'Image',
        ordered: false,
        numeric: false
    },
    {
        id: 'price',
        label: 'Price',
        ordered: true,
        numeric: true
    },
    {
        id: 'quantity',
        label: 'Quantity',
        ordered: true,
        numeric: true
    },
    {
        id: 'available',
        label: 'Available',
        ordered: true,
        numeric: true
    },
    {
        id: 'filler1',
        label: '',
        ordered: false,
        numeric: false
    },
    {
        id: 'filler2',
        label: '',
        ordered: false,
        numeric: false
    },
];

export const getInventoryItems = (sellerId) => (queryParams:InventoryQueryParams) => {
    return new Promise<InventoryResponse>((resolve, reject) => {
        instance.get('/api/inventory_by_id', { params: { 
            ...queryParams,
            seller_id: sellerId,
        }})
        .then(({ data }) => resolve(data as InventoryResponse));
    });
};