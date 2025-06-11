export interface Charge {
  type: string;
  charge: number;
  percent: string;
}

export interface Dispatch {
  id: number;
  carrier: string;
  contact: string;
  equipment: string;
  driver_mobile: string;
  truck_unit_no: string;
  trailer_unit_no: string;
  paps_pars_no: string;
  tracking_code: string;
  border: string;
  currency: string;
  rate: string;
  charges: Charge[];
  discounts: Charge[];
  gst: string;
  pst: string;
  hst: string;
  qst: string;
  final_price: string;
  status: string;
  created_at: string;
  updated_at: string;
}
