function login() {
      var username = document.getElementById("username").value;
      var password = document.getElementById("password").value;
    
      if (username === "abc" && password === "123") {
        window.location.href = "chooseSys.html"; 
      } else {
        alert("帳號或密碼錯誤");
      }
    }