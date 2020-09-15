const { TestScheduler } = require("jest");

const lib = require('../lib');
const db = require('../db');
const mail = require('../mail');

describe('absolute',() => {
  
test('should return a positive number if input is positive',() =>{
    const result = lib.absolute(1);
    expect(result).toBe(1);
});

test('should return a positive number if input is negative',() =>{
const result = lib.absolute(-1);
expect(result).toBe(1);
});

test('should return 0 if input is 0',() =>{
const result = lib.absolute(0);
expect(result).toBe(0);
});
});

describe('greet', () =>{
    it('should return the greeting message',() =>{
        const result = lib.greet('Tulip');
        expect(result).toMatch(/Tulip/); //using regular expression
        expect(result).toContain('Tulip'); //using toContain method
    }); 
});

describe('getCurrencies',() => {
    it('should return supported currencies',() =>{
        const result = lib.getCurrencies();

        //Too general
        expect(result).toBeDefined();
        expect(result).not.toBeNull();

        //Too specific
        expect(result[0]).toBe('USD');
        expect(result[1]).toBe('AUD');
        expect(result[2]).toBe('EUR');

        expect(result.length).toBe(3);

        //Proper way
        expect(result).toContain('USD');
        expect(result).toContain('AUD');
        expect(result).toContain('EUR');

        //Ideal way
        expect(result).toEqual(expect.arrayContaining(['EUR','AUD','USD']));
    })
});

describe('getProduct', () => {
    it('should return the product with the given id' , () =>{
        const result = lib.getProduct(1);
        //Too specific
        expect(result).toEqual({id : 1, price : 10});

        //Ideal way
        expect(result).toMatchObject({id : 1, price : 10});
        expect(result).toHaveProperty('id',1);
    })
});

describe('registerUser',() =>{
    it('should throw if username is falsy',() => {

        expect(() => {lib.registerUser(null)}).toThrow(); // do the same way for all the falsy conditions
        /*  const args = [null,undefined,NaN,'',0,false];

         args.forEach(a => { lib.registerUser(a) }).toThrow(); */
    });

    it('should return a user object if valid username is passed', () => {
        const result = lib.registerUser('Tulip');
        expect(result).toMatchObject({username : 'Tulip'});
        expect(result.id).toBeGreaterThan(0);
    })
});

describe('applyDiscount',() => {
    it('should apply 10% discount if customer has more than 10 points',() => {
        db.getCustomerSync = function (customerId){
            console.log('Fake reading cusotmer....');
            return {id : customerId,points : 20};
        }
        const order = {customerId : 1, totalPrice : 10};
        lib.applyDiscount(order);
        expect(order.totalPrice).toBe(9);
    })
});

describe('notifyCustomer',() => {
    it('should send an email to the customer', () => {
        db.getCustomerSync=function(customerId){
            return { email : 'a'};
        }

        let mailSent = false;
        mail.send = function(email,message){
            mailSent = true;
        }

        lib.notifyCustomer({customerId : 1});
        expect(mailSent).toBe(true);
    });
    
    it('should send an email to the customer - using Jest mock functions', () => {
        db.getCustomerSync= jest.fn().mockReturnValue({email : 'a'});
        mail.send = jest.fn();

        lib.notifyCustomer({customerId : 1});

        expect(mail.send).toHaveBeenCalled();
        expect(mail.send.mock.calls[0][0]).toBe('a');
        expect(mail.send.mock.calls[0][1]).toMatch(/order/);
    });

});