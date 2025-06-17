interface OrderDetails {
  positionNumber: string;
  materialCode: string;
  materialName: string;
  quantity: string;
  um: string;
  logisticUnity: string;
  stock: string;
  warning?: boolean;
}
export interface TableData {
  orderNumber: string;
  client: string;
  agent: string;
  data: string;
  zone: string;
  status: string;
  reason: string;
  responsive: string;
  lockDuration: string;
  partialDelivery: string;
  totalBlockage: string;
  orderDetails: OrderDetails[];
}
