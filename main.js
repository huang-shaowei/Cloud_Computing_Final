$(document).ready(init);

var account = {};
account.balance = 100;

function init(){
  var currentDate = moment().format('YYYY-MM-DD');
  $('#date').attr("max", currentDate);
  clickHandler();
}

function clickHandler(){
  $("#newTransaction").submit(addTransaction);
  $("#transactions").on("click", ".trashButton", deleteTransaction); // deferred event handler
  $("#typeOfTransaction").change(filterTransactions);
}

function addTransaction(event){
  event.preventDefault();

  var transactionType = $('#transactionType').val();
  var content = $('#content').val();
  var amount = parseFloat($('#amount').val());
  var date = $('#date').val();
  var formattedDate = moment(date).format("ll");

  updateBalance(transactionType, amount);

  var $tableRow = $("#template").clone();
  if (transactionType === "deposit"){
    $tableRow.addClass("deposit");
  } else{
    $tableRow.addClass("withdrawals");
  }
  $tableRow.removeAttr("id");
  $tableRow.data("amount", getFormattedAmount(transactionType, amount));
  $tableRow.children(".date").text(formattedDate);
  $tableRow.children(".content").text(content);
  $tableRow.children(".amount").text(numeral(getFormattedAmount(transactionType, amount)).format('$0,0.00'));
  $tableRow.children(".runningBalance").text(numeral(account["balance"]).format('$0,0.00'));
  $("#transactions").prepend($tableRow);
  $("#newTransaction").trigger("reset"); // reset form
}

function deleteTransaction(){
  var $currentRow = $(this).closest("tr");
  var rowAmount = $currentRow.data("amount");

  undoTransaction(rowAmount);
  $currentRow.remove();
}

function undoTransaction(rowAmount){
  account.balance -= rowAmount;
  $('h3').text("Current Account Balance: " + numeral(account["balance"]).format('$0,0.00'));
}

function updateBalance(transactionType, amount){
  if (transactionType === "deposit"){
    account.balance += amount;
  } else{
    account.balance -= amount;
  }
  $('h3').text("Current Account Balance: " + numeral(account["balance"]).format('$0,0.00'));
  
}

function getFormattedAmount(transactionType, amount){
  if (transactionType === "deposit"){
    return amount;
  } else{
    return amount * -1;
  }
}

function filterTransactions(){
  var transactionType = $(this).val();
  $("#transactions tr").hide();

  switch(transactionType){
    case "deposits":
      $(".deposit").show();
      break;
    case "withdrawals":
      $('.withdrawals').show();
      break;
    default:
      $('#transactions tr').not("#template").show();
      break;
  }
}