import { Query } from "./query.js";
import { UsersAdmPanel } from "./users-adm-panel.js";

async function main() {
  const url = "http://localhost:3000/users";
  const opts = {
    scrnSmBreakpoint: "576px",
    scrnMdBreakpoint: "768px",
    scrnLgBreakpoint: "992px",
    scrnXlBreakpoint: "1200px"
  };

  const query = new Query(url);
  const $wrapperElement = $('.users-wrapper');
  UsersAdmPanel.create($wrapperElement, query, opts);
}

main();