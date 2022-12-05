import React from "react";
import { Invoice } from "../../interfaces";
import { Table } from "@mantine/core";

import dayjs from "dayjs";

type Props = {
  sumInvoices: {
    sum: number;
    startDate: string;
    stopDate: string;
    invoices: Invoice[];
  };
};

const InvoiceTable = (props: Props) => {
  return (
    <Table
      highlightOnHover
      horizontalSpacing="md"
      verticalSpacing="xs"
      captionSide="top"
    >
      <caption>
        Sent {props.sumInvoices.invoices.length} invoices year {dayjs().year()},
        total: {props.sumInvoices.sum.toLocaleString()} SEK
      </caption>
      <thead
        style={{
          top: "0",
          position: "sticky",
          zIndex: "2",
          backdropFilter: "blur(4px)",
        }}
      >
        <tr>
          <th>Customer</th>
          <th>Status</th>
          <th>Due date</th>
          <th>Fee</th>
        </tr>
      </thead>
      <tbody>
        {props.sumInvoices.invoices &&
          props.sumInvoices.invoices.map((invoice) => (
            <tr key={invoice.id}>
              <td>{invoice.customer}</td>
              <td>{invoice.status}</td>
              <td>{invoice.dueDate}</td>
              <td>{invoice.fee}</td>
            </tr>
          ))}
      </tbody>
    </Table>
  );
};

export default InvoiceTable;
