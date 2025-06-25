export interface Bank {
  name: string;
  phone: string;
  email: string;
  address: string;
  us_account_no: string;
  cdn_account_no: string;
}

export interface Cargo {
  company: string;
  policy_start: string;
  policy_end: string;
  amount: string;
}

export interface Liability {
  company: string;
  policy_start: string;
  policy_end: string;
  amount: string;
}

export interface Company {
  id: number;
  name: string;
  invoice_terms: string;
  rate_conf_terms: string;
  quote_terms: string;
  invoice_reminder: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postal: string;
  email: string;
  phone: string;
  cell: string;
  fax: string;
  invoice_prefix: string;
  SCAC: string;
  docket_no: string;
  carrier_code: string;
  gst_hst_no: string;
  qst_no: string;
  ca_bond_no: string;
  website: string;
  obsolete: boolean;
  us_tax_id: string;
  payroll_no: string;
  wcb_no: string;
  dispatch_email: string;
  ap_email: string;
  ar_email: string;
  cust_comm_email: string;
  quot_email: string;
  bank_info: Bank[];
  cargo_insurance: Cargo[];
  liablility_insurance: Liability[];
  company_package: string | File | null;
  insurance: string | File | null;
  created_at: string;
  updated_at: string;
}
