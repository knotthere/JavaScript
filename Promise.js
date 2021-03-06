var example1 = function () {

  var result = Promise.resolve(1)
    .then(function (success) {
      return 2;
    }).then(function (success) {
      return 3;
    });

  // Promise { <pending> }
  console.log(result);

  result.then(function (success) {
    // This occurs
    console.log(success);
  }).catch(function (error) {
    console.log(error);
  }).then(function (success) {
  })
}

var example2 = function () {

  var result = Promise.resolve(1);
  // Promise { 1 }
  console.log(result);

  var result2 = result.then(function (success) {
    return 2;
  });
  // Promise { <pending> }
  console.log(result2);

  var result3 = result2.then();
  console.log(result3.resolve());
}

var example3 = function () {
  Promise.resolve('foo')
    // 1. Receive "foo" concatenate "bar" to it and resolve that to the next then
    .then(function (string) {
      return new Promise(function (resolve, reject) {
        setTimeout(function () {
          string += 'bar';
          resolve(string);
        }, 1);
      });
    })
    // 2. receive "foobar", register a callback function to work on that string
    // and print it to the console, but not before return the unworked on
    // string to the next then
    .then(function (string) {
      setTimeout(function () {
        string += 'baz';
        console.log(string);
      }, 1)
      return string;
    })
    // 3. print helpful messages about how the code in this section will be run
    // before string is actually processed by the mocked asynchronous code in the
    // prior then block.
    .then(function (string) {
      console.log("Last Then:  oops... didn't bother to instantiate and return " +
        "a promise in the prior then so the sequence may be a bit " +
        "surprising");

      // Note that `string` will not have the 'baz' bit of it at this point. This
      // is because we mocked that to happen asynchronously with a setTimeout function
      console.log(string);

      //process.exit(0);
    });
}

var example4 = function () {
  // A promise resolves, and then in its handler, rejects...
  Promise.resolve('1')
    .then(function (success) {
      console.log(success);
      return Promise.reject('2');
    }, function (error) {
      console.log(error);
      return Promise.reject('3');
    }).then(function (success) {
      console.log(success);
    }).catch(function (error) {
      // Note, this catch handler wins!  The function(error) above is not called.
      console.log(error);
    });
}

// Do we need to bother adding an onReject handler if we don't change the rejection value?
var example5a = function () {

  var fcn = 'example5a';
  return Promise.resolve(fcn + ' - resolve 1')
    .then(function (success) {
      console.log(success);
      return Promise.reject(fcn + ' - reject 1');
    }, function (error) {
      console.log(error);
      return Promise.reject(fcn + ' - reject 2');
    });
}

// Here we don't exlicitly specify an onReject() handler
var example5b = function () {

  var fcn = 'example5b';
  return Promise.resolve(fcn + ' - resolve 1')
    .then(function (success) {
      console.log(success);
      return Promise.reject(fcn + ' - reject 1');
    });
}

// Test the two responses here - are they the same with an onReject() handler at the caller?
var example6 = function () {
  var local5a = example5a();
  var local5b = example5b();

  console.log(local5a); // pending
  console.log(local5b); // pending

  // Using an onReject() handler...
  local5a.then(function (success) {
    console.log(success);
  }, function (error) {
    console.log(error);
  });

  local5b.then(function (success) {
    console.log(success);
  }, function (error) {
    console.log(error);
  });
}

// Test the two responses here - are they the same with a catch() handler at the caller?
var example7 = function () {
  var local5a = example5a();
  var local5b = example5b();

  console.log(local5a); // pending
  console.log(local5b); // pending

  // Using an onReject() handler...
  local5a.then(function (success) {
    console.log(success);
  }).catch(function (error) {
    console.log(error);
  });

  local5b.then(function (success) {
    console.log(success);
  }).catch(function (error) {
    console.log(error);
  });
}

// Can we throw an Error from a Promise, and is that captured by the caller as a rejection?
var example8 = function () {
  // Here's a method we expected to return a Promise, but instead it threw an exception:
  var throwError = function () { throw Error('Error thrown'); };
  var returnReject = function () { return Promise.reject('Rejected Promise returned'); };

  try {
    var promiseThrow = new Promise(function (success) { returnThrow(); });
    var promiseReject = new Promise(function (success) { returnReject(); });

    promiseThrow.then(function (success) {
      console.log(success);
    }).catch(function (error) {
      console.log(error);
    });

    promiseReject.then(function (success) {
      console.log(success);
    }).catch(function (error) {
      console.log(error);
    });
  } catch (e) {
    console.log(e);
  }
}

//example1();
//example2();
//example3();
//example4();
//example6();
//example7();
example8();
