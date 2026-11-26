// Registry that every question file adds itself to.
// Load this before any file in questions/ or js/drills.js.
window.NUMERACY = {
  workbooks: [],
  drills: [],
  addWorkbook(workbook) {
    this.workbooks.push(workbook);
  },
  addDrill(drill) {
    this.drills.push(drill);
  }
};
