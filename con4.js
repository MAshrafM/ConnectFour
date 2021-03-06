class Connect4{
  constructor(selector){
    this.ROWS = 6;
    this.COLS = 7;
    this.player = 'red';
    this.isGameOver = false;
    this.selector = selector;
    this.createGrid();
    this.setupEventListeners();
  }
  
  // dynamically create grid.
  createGrid(){
    const $board = $(this.selector);
    $board.empty();
    this.isGameOver = false;
    this.player = 'red';
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
      if(that.isGameOver) return;
      const col = $(this).data('col');
      const $lastEmptyCell = findLastEmptyCell(col);
      $lastEmptyCell.addClass(`next-${that.player}`);
    });
    
    $board.on('mouseleave', '.col', function() {
      $('.col').removeClass(`next-${that.player}`);
    });
    // Game play
    // Alternate players
    $board.on('click', '.col.empty', function() {
      if(that.isGameOver) return;
      const col = $(this).data('col');
      const row = $(this).data('row');
      const $lastEmptyCell = findLastEmptyCell(col);
      $lastEmptyCell.removeClass('empty');
      $lastEmptyCell.addClass('fall');
      $lastEmptyCell.addClass(that.player);
      $lastEmptyCell.data('player', that.player);
      // check for winner
      const winner = that.checkForWinner($lastEmptyCell.data('row'), $lastEmptyCell.data('col'));
      if(winner) {
        that.isGameOver = true;
        alert('Winner ' + that.player);
        $('.col.empty').removeClass('empty');
        return;
      }
      // alternate players
      that.player = (that.player == 'red') ? 'blue' : 'red';
      $(this).trigger('mouseenter');
    });
    
  }
  // check winners
  checkForWinner(row, col) {
    const that = this;
    // get jquery cell
    function $getCell(i, j){
      return $(`.col[data-row='${i}'][data-col='${j}']`);
    }
    // check direction
    // loop through possible wins
    function checkDir(dir){
      let total = 0;
      let i  = row + dir.i;
      let j = col + dir.j;
      let $next = $getCell(i, j);
      while(i >= 0 && i < that.ROWS && j >= 0 && j < that.COLS && $next.data('player') === that.player ) {
        total++;
        i += dir.i;
        j += dir.j;
        $next = $getCell(i, j);
      }
      return total;
    }
    // check winning direction
    function checkWin(dirA, dirB) {
      const total = 1 + checkDir(dirA) + checkDir(dirB);
      return total >= 4 ? that.player : null;
    }
    
    // check verticals in both up/down directions
    function checkVer() {
      return checkWin({i: -1, j: 0}, {i: 1, j: 0})
    }
    // check horizontal in both left/right directions
    function checkHor(){
      return checkWin({i: 0, j: -1}, {i: 0, j: 1})
    }
    // check diagonal
    function checkDiagLR(){
      return checkWin({i: 1, j: -1}, {i: 1, j: 1})
    }
    function checkDiagRL(){
      return checkWin({i: -1, j: 1}, {i: -1, j: -1})
    }
    return checkVer() || checkHor() || checkDiagLR() || checkDiagRL();
  }
  
  restart() {
    this.createGrid();
  }
}
