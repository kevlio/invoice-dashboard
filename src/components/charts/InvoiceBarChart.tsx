import React, { useEffect, useState } from "react";

import { useDashboard } from "../../context/DashboardContext";

import dayjs from "dayjs";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { Invoice } from "../../interfaces";

type InvoicesYearly = {
  month: string;
  invoices: Invoice[];
  invoiced: number;
};

const InvoiceBarChart = () => {
  const { invoices } = useDashboard();
  const [yearlyInvoices, setYearlyInvoices] = useState<InvoicesYearly[]>();

  useEffect(() => {
    invoicesThisYear();
  }, [invoices]);

  const invoicesThisYear = () => {
    const invoicesThisYear = invoices.filter((invoice) => {
      if (dayjs().isSame(invoice.sentAt, "year")) return invoice;
    });

    const invoiceArray: InvoicesYearly[] = [];
    for (let i = 1; i <= 12; i++) {
      const invoices = invoicesThisYear.filter(
        (invoice) => invoice.sentAt.split("-")[1] === i.toString()
      );

      const sumInvoices: number = invoices.reduce((acc, el) => acc + el.fee, 0);

      const newObject = {
        month: dayjs(dayjs().year() + "-" + i.toString()).format("YYYY-MM"),
        invoices,
        invoiced: sumInvoices,
      };
      invoiceArray.push(newObject);
    }
    setYearlyInvoices(invoiceArray);
  };

  return (
    <ResponsiveContainer width="99%" height={300}>
      <div>
        <BarChart
          width={320}
          height={300}
          data={yearlyInvoices}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="invoiced" fill="#8884d8" />
        </BarChart>
      </div>
    </ResponsiveContainer>
  );
};

export default InvoiceBarChart;
