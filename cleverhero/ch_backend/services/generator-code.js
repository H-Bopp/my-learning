

export default {

    findUser(email){
        /* verifications */
        if(onCreationUsers.find(newuser => newuser.userdata.email === email.email) != undefined){
            // TODO : ici il faudrait plutot ecrase le code avec un nouveau et le renvoyer
            return -1;
        }
        tokenSearch++;        
        var id = tokenSearch;

        onSearchingUsers.push({
            userdata: email,
            id: id,
            phonecode: 'phoneCode' + getRandomInt(100)
        });
        return id
    

    },
    
    getToken (user) {
        /* verifications */
        if(onCreationUsers.find(newuser => newuser.userdata.email === user.email 
                && newuser.userdata.phone === user.phone
                && newuser.userdata.pwd === user.pwd) != undefined){
            return -1;
        }

        tokenCreation++;        
        var id = tokenCreation;


        onCreationUsers.push({
            userdata: user,
            id: id,
            emailcode: 'emailCode' + getRandomInt(100),
            phonecode: 'phoneCode' + getRandomInt(100)
        });
        return id
    },

    getEmailCode (id) {  
        var usr = onCreationUsers.find(newuser => newuser.userdata.id === id);
        return usr.emailcode;
    },
    getPhoneCode (id) {  
        var usr = onCreationUsers.find(newuser => newuser.userdata.id === id);
        return usr.phonecode;
    },
    getSearchCode (id) {  
        var usr = onSearchingUsers.find(newuser => newuser.userdata.id === id);
        return usr.phonecode;
    },
    
    checkEmailCode () { return true },
    checkPhoneCode () { return true }
}