// Procedural names generator from the '50s
"use strict";
// globals: document, window

var SC = window.SC || {};

SC.names = (function () {
    var self = {};
    self.male = ["James", "Michael", "Robert", "John", "David", "William", "Richard", "Thomas", "Mark", "Charles", "Steven", "Gary", "Joseph", "Donald", "Ronald", "Kenneth", "Paul", "Larry", "Daniel", "Stephen", "Dennis", "Timothy", "Edward", "Jeffrey", "George", "Gregory", "Kevin", "Douglas", "Terry", "Anthony", "Jerry", "Bruce", "Randy", "Frank", "Brian", "Scott", "Roger", "Raymond", "Peter", "Patrick", "Keith", "Lawrence", "Wayne", "Danny", "Alan", "Gerald", "Ricky", "Carl", "Christopher", "Dale", "Walter", "Craig", "Willie", "Johnny", "Arthur", "Steve", "Joe", "Randall", "Russell", "Jack", "Henry", "Harold", "Roy", "Andrew", "Philip", "Ralph", "Billy", "Glenn", "Stanley", "Jimmy", "Rodney", "Barry", "Samuel", "Eric", "Bobby", "Albert", "Phillip", "Ronnie", "Martin", "Mike", "Eugene", "Louis", "Howard", "Allen", "Curtis", "Jeffery", "Frederick", "Leonard", "Harry", "Micheal", "Tony", "Ernest", "Eddie", "Fred", "Darrell", "Jay", "Melvin", "Lee", "Matthew", "Vincent", "Tommy", "Francis", "Marvin", "Dean", "Rick", "Victor", "Norman", "Earl", "Jose", "Calvin", "Ray", "Clifford", "Alfred", "Jerome", "Bradley", "Clarence", "Don", "Theodore", "Jon", "Rickey", "Joel", "Jesse", "Jim", "Edwin", "Dan", "Chris", "Bernard", "Jonathan", "Gordon", "Glen", "Jeff", "Warren", "Leroy", "Herbert", "Duane", "Bill", "Benjamin", "Tom", "Alvin", "Nicholas", "Tim", "Mitchell", "Marc", "Leslie", "Leon", "Kim", "Dwight", "Bryan", "Lloyd", "Vernon", "Gene", "Reginald", "Lonnie", "Guy", "Gilbert", "Garry", "Juan", "Karl", "Kent", "Kurt", "Todd", "Jackie", "Greg", "Lewis", "Wesley", "Clyde", "Floyd", "Neil", "Allan", "Donnie", "Perry", "Franklin", "Lester", "Brad", "Manuel", "Kirk", "Carlos", "Leo", "Jimmie", "Randolph", "Charlie", "Robin", "Dana", "Darryl", "Dave", "Ted", "Milton", "Daryl", "Kerry", "Freddie", "Brent", "Harvey", "Gerard", "Stuart", "Johnnie", "Herman", "Lynn", "Rex", "Arnold", "Kelly"];
    self.female = ["Mary", "Linda", "Patricia", "Susan", "Deborah", "Barbara", "Debra", "Karen", "Nancy", "Donna", "Cynthia", "Sandra", "Pamela", "Sharon", "Kathleen", "Carol", "Diane", "Brenda", "Cheryl", "Janet", "Elizabeth", "Kathy", "Margaret", "Janice", "Carolyn", "Denise", "Judy", "Rebecca", "Joyce", "Teresa", "Christine", "Catherine", "Shirley", "Judith", "Betty", "Beverly", "Lisa", "Laura", "Theresa", "Connie", "Ann", "Gloria", "Julie", "Gail", "Joan", "Paula", "Peggy", "Cindy", "Martha", "Bonnie", "Jane", "Cathy", "Robin", "Debbie", "Diana", "Marilyn", "Kathryn", "Dorothy", "Wanda", "Jean", "Vicki", "Sheila", "Virginia", "Sherry", "Katherine", "Rose", "Lynn", "Jo", "Ruth", "Maria", "Darlene", "Jacqueline", "Rita", "Rhonda", "Phyllis", "Helen", "Vickie", "Kim", "Lori", "Ellen", "Elaine", "Joanne", "Anne", "Valerie", "Alice", "Frances", "Suzanne", "Marie", "Victoria", "Kimberly", "Anita", "Laurie", "Michelle", "Sally", "Terri", "Marcia", "Terry", "Jennifer", "Leslie", "Doris", "Maureen", "Wendy", "Michele", "Anna", "Marsha", "Angela", "Sarah", "Sylvia", "Jill", "Dawn", "Sue", "Evelyn", "Roberta", "Jeanne", "Charlotte", "Eileen", "Lois", "Colleen", "Stephanie", "Annette", "Glenda", "Yvonne", "Dianne", "Tina", "Beth", "Lorraine", "Constance", "Renee", "Charlene", "Joann", "Julia", "Gwendolyn", "Norma", "Regina", "Amy", "Loretta", "Sheryl", "Carla", "Andrea", "Tammy", "Irene", "Jan", "Louise", "Juanita", "Marlene", "Penny", "Rosemary", "Becky", "Kay", "Joy", "Geraldine", "Jeanette", "Gayle", "Annie", "Vivian", "Claudia", "Lynda", "Melissa", "Audrey", "Lynne", "Patsy", "Melinda", "Vicky", "Toni", "June", "Belinda", "Marjorie", "Arlene", "Patti", "Ruby", "Sara", "Yolanda", "Rosa", "Melanie", "Christina", "Delores", "Jackie", "Vanessa", "Carmen", "Monica", "Janis", "Holly", "Marianne", "Dolores", "Shelley", "Veronica", "Mildred", "Eva", "Dana", "Rachel", "Shelia", "Roxanne", "Carole", "Lillian", "Josephine", "Carrie", "Patty", "Sherri", "Doreen", "Grace"];
    self.surname = ["Adams", "Alexander", "Allen", "Anderson", "Bailey", "Baker", "Barnes", "Bell", "Bennett", "Brooks", "Brown", "Bryant", "Butler", "Campbell", "Carter", "Clark", "Coleman", "Collins", "Cook", "Cooper", "Cox", "Davis", "Diaz", "Edwards", "Evans", "Flores", "Foster", "Garcia", "Gonzales", "Gonzalez", "Gray", "Green", "Griffin", "Hall", "Harris", "Hayes", "Henderson", "Hernandez", "Hill", "Howard", "Hughes", "Jackson", "James", "Jenkins", "Johnson", "Jones", "Kelly", "King", "Lee", "Lewis", "Long", "Lopez", "Martin", "Martinez", "Miller", "Mitchell", "Moore", "Morgan", "Morris", "Murphy", "Nelson", "Parker", "Patterson", "Perez", "Perry", "Peterson", "Phillips", "Powell", "Price", "Ramirez", "Reed", "Richardson", "Rivera", "Roberts", "Robinson", "Rodriguez", "Rogers", "Ross", "Russell", "Sanders", "Sanchez", "Scott", "Simmons", "Smith", "Stewart", "Taylor", "Thomas", "Thompson", "Torres", "Turner", "Walker", "Ward", "Washington", "Watson", "White", "Williams", "Wilson", "Wood", "Wright", "Young"];

    self.random = function (aFemale) {
        // Random name and surname
        return SC.randomItem.apply({}, (aFemale ? self.female : self.male)) + ' ' + SC.randomItem.apply({}, self.surname);
    };

    self.randomName = function (aFemale) {
        // Random first name
        return SC.randomItem.apply({}, aFemale ? self.female : self.male);
    };

    self.randomMiddleName = function (aFemale) {
        // Random middle initial
        var n = SC.randomItem.apply({}, aFemale ? self.female : self.male);
        return n.substr(0, 1) + '.';
    };

    self.randomSurname = function () {
        // Random surname
        return SC.randomItem.apply({}, self.surname);
    };

    return self;
}());

