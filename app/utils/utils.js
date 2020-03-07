
/* Common method for uses */


/* Common Response setup */
exports.setUpResponse = (res, sign, result) => {
    switch (sign) {
        case "OK":
            res.statusMessage = sign;
            res.status(200).json(result);
            break;

        case "Created":
            res.statusMessage = sign;
            res.status(201).send();
            break;

        case "Not Found":
            res.statusMessage = sign;
            res.status(404).send();
            break;

        case "Bad Request":
            res.statusMessage = sign;
            res.status(400).send();
            break;
    
        default:
            break;
    }
}