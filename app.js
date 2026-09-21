"use strict";

const form = document.querySelector(".campaign-form");
const revenueInput = document.querySelector("#total-revenue");
const averageOrderValueInput = document.querySelector("#average-order-value");
const leadResponseRateInput = document.querySelector("#lead-response-rate");
const prospectResponseRateInput = document.querySelector("#prospect-response-rate");
const chartPlot = document.querySelector("#chart-plot");

const metrics = {
  prospects: {
    value: document.querySelector("#prospects-value"),
    barValue: document.querySelector("#prospects-bar-value"),
    bar: document.querySelector("#prospects-bar"),
    percentage: document.querySelector("#prospects-percentage"),
    progress: document.querySelector("#prospects-value").closest(".metric-card").querySelector(".metric-progress span"),
  },
  leads: {
    value: document.querySelector("#leads-value"),
    barValue: document.querySelector("#leads-bar-value"),
    bar: document.querySelector("#leads-bar"),
    percentage: document.querySelector("#leads-percentage"),
    progress: document.querySelector("#leads-value").closest(".metric-card").querySelector(".metric-progress span"),
  },
  customers: {
    value: document.querySelector("#customers-value"),
    barValue: document.querySelector("#customers-bar-value"),
    bar: document.querySelector("#customers-bar"),
    percentage: document.querySelector("#customers-percentage"),
    progress: document.querySelector("#customers-value").closest(".metric-card").querySelector(".metric-progress span"),
  },
};

const responseRateValues = {
  leads: document.querySelector("#lead-response-rate-value"),
  prospects: document.querySelector("#prospect-response-rate-value"),
};

const formatNumber = (value) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(value);

const readPositiveNumber = (input) => {
  const value = Number.parseFloat(input.value);
  return Number.isFinite(value) && value > 0 ? value : null;
};

const updateMetric = (metric, value, percentage, maxValue) => {
  const formattedValue = formatNumber(value);
  metric.value.textContent = formattedValue;
  metric.barValue.textContent = formattedValue;
  metric.percentage.textContent = `${formatNumber(percentage)}%`;
  metric.bar.style.setProperty("--bar-height", `${Math.max((value / maxValue) * 100, 1)}%`);
  metric.progress.style.width = `${Math.max((value / maxValue) * 100, 1)}%`;
};

const updateDashboard = () => {
  const revenue = readPositiveNumber(revenueInput);
  const averageOrderValue = readPositiveNumber(averageOrderValueInput);
  const leadResponseRate = readPositiveNumber(leadResponseRateInput);
  const prospectResponseRate = readPositiveNumber(prospectResponseRateInput);

  if (!revenue || !averageOrderValue || !leadResponseRate || !prospectResponseRate) {
    return;
  }

  // Formula 01: customers = revenue / average order value.
  const customers = revenue / averageOrderValue;
  // Formula 02: leads = customers * 100 / lead response rate.
  const leads = (customers * 100) / leadResponseRate;
  // Formula 03: prospects = leads * 100 / prospect response rate.
  const prospects = (leads * 100) / prospectResponseRate;
  const maxValue = Math.max(prospects, 1);

  updateMetric(metrics.prospects, prospects, 100, maxValue);
  updateMetric(metrics.leads, leads, (leads / prospects) * 100, maxValue);
  updateMetric(metrics.customers, customers, (customers / prospects) * 100, maxValue);

  chartPlot.setAttribute(
    "aria-label",
    `Campaign overview: ${formatNumber(prospects)} prospects, ${formatNumber(leads)} leads, and ${formatNumber(customers)} customers`,
  );
  responseRateValues.leads.textContent = `${Number(leadResponseRate).toFixed(2)}%`;
  responseRateValues.prospects.textContent = `${Number(prospectResponseRate).toFixed(2)}%`;
};

form.addEventListener("input", updateDashboard);
leadResponseRateInput.addEventListener("input", updateDashboard);
prospectResponseRateInput.addEventListener("input", updateDashboard);
updateDashboard();
