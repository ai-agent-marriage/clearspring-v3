/**
 * wx-xlsx mock for testing
 */
module.exports = {
  utils: {
    aoa_to_sheet: jest.fn(() => ({})),
    json_to_sheet: jest.fn(() => ({})),
    book_new: jest.fn(() => ({})),
    book_append_sheet: jest.fn(),
    sheet_add_json: jest.fn()
  },
  write: jest.fn(() => new ArrayBuffer(100)),
  writeFile: jest.fn()
}
