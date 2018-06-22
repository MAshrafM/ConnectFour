class Connect4{
  constructor(selector){
    this.ROWS = 6;
    this.COLS = 7;
    this.player = 'red';
    this.selector = selector;
    this.createGrid();
    this.setupEventListeners();
  }
  
  // dynamically create grid.
  createGrid(){
    const $board = $(this.selector);
    for(let row = 0; row < this.ROWS; row++){
      const $row = $('<div>').addClass('row');
      for(let col = 0; col < this.COLS; col++){
        const $col = $('<div>').addClass('col empty').attr('data-col', col).attr('data-row', row);
        $row.append($col);
      }
      $board.append($row);
    }
  }
  
  setupEventListeners() {
    const $board = $(this.selector);
    const that = this;
    // Find Empty Cells in the grid
    // grab cols and loop through them to find the last empty cells
    // return cell or null if not found empty cells
    function findLastEmptyCell(col) {
      const cells = $(`.col[data-col='${col}']`);
      for(let i = cells.length - 1; i >= 0; i--){
        const $cell = $(cells[i]);
        if($cell.hasClass('empty')){
          return $cell;
        }
      }
      return null;
    }
    // simulate your next move on an empty cell
    $board.on('mouseenter', '.col.empty', function(){
      const col = $(this).data('col');
      const $lastEmptyCell = findLastEmptyCell(col);
      $lastEmptyCell.addClass(`next-${that.player}`);
    });
    
    $board.on('mouseleave', '.col', function() {
      $('.col').removeClass(`next-${that.player}`);
    });
    
    $board.on('click', '.col.empty', function() {
      const col = $(this).data('col');
      const $lastEmptyCell = findLastEmptyCell(col);
      $lastEmptyCell.removeClass('empty');
      $lastEmptyCell.addClass(that.player);
      that.player = (that.player == 'red') ? 'blue' : 'red';
      $(this).trigger('mouseenter');
    });
  }
}
