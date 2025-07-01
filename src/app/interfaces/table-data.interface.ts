interface OrderDetails {
  positionNumber: number;
  materialCode: string;
  materialName: string;
  quantity: number;
  um: string;
  logisticUnity: string;
  stock: number;
  warning?: boolean;
}
export interface TableData {
  orderNumber: string;
  client: string;
  agent: string;
  data: number;
  zone: string;
  status: string;
  reason: string;
  responsive: string;
  lockDuration: number;
  partialDelivery: string;
  totalBlockage: number;
  orderDetails: OrderDetails[];
  highlight?: boolean;
}
