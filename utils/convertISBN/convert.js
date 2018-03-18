var Ranges = require('./Ranges.js').Ranges;

function is_numeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

class Isbn{
	
	constructor(code = null)
	{
		// Error messages (for localization)
		const ERROR_EMPTY = 'No code provided',
			  ERROR_INVALID_CHARACTERS = 'Invalid characters in the code',
			  ERROR_INVALID_LENGTH = 'Code is too short or too long',
			  ERROR_INVALID_COUNTRY = 'Country code unknown';
		this.product; // GS1 Product Code (978 or 979 for books)
		this.country; // Registrant group (country) code
		this.publisher; // Registrant (publisher) Code
		this.publication; // Publication code
		this.checksum; // Checksum character
		this.input; // Input code
		this.isValid = true; // Is the code a valid ISBN
		this.errors = []; // Why is the code invalid
		this.format = 'EAN'; // Output format
		this.prefixes; // XML ranges file prefixes
		this.groups; // XML ranges file groups
		this.agency; // ISBN Agency

		/**
		 * @var Ranges
		 */
		this.ranges = null;

		if (code && code != "")
		{
			this.input = code;
			// Remove hyphens and check characters
			code = this.removeHyphens(code);
			// Remove checksum and check length
			code = this.removeChecksum(code);

			if (this.isIsbnValid())
			{
				// Remove (and set) product code
				code = this.removeProductCode(code);
				// Remove (and save) country code
				code = this.removeCountryCode(code);
				// Remove (and save) publisher code
				this.removePublisherCode(code);
			}
		}
		else
		{
			this.addError(ERROR_EMPTY);
			this.setValid(false);
		}
	}
	/**
	 * Gets a class that knows about the ISBN ranges
	 *
	 * @return Ranges
	 */
	getRanges(){
		if (this.ranges !== null) {
			return this.ranges;
		}
		return this.ranges = new Ranges();
	}
	/* Check methods */
	/**
	 * Check if ISBN is valid
	 */
	isIsbnValid(){
		return this.isValid;
	}
	/* Format methods */
	/**
	 * Format an ISBN according to specified format
	 * @param string format (ISBN-10, ISBN-13, EAN)
	 */
	formatIsbn(format = 'EAN'){
		this.calculateChecksum(format);
		var A = this.getProduct();
		var B = this.getCountry();
		var C = this.getPublisher();
		var D = this.getPublication();
		var E = this.getChecksum();

		if(format == 'ISBN-10')
		{

			return B+C+D+E;
		}
		else if(format == 'ISBN-13' || format == 'ISBN')
		{
			return A+B+C+D+E;
		}
		else
		{
			return A+B+C+D+E;
		}
	}
	// Private methods
	/**
	 * Set ISBN Validity
	 */
	setValid(isValid)
	{
		this.isValid = isValid;
	}
	/**
	 * Add to error log
	 */
	addError(error)
	{
		this.errors.push(error);
	}
	/**
	 * Delete '-', '_' and ' '
	 */
	removeHyphens(code)
	{
		// Remove Hyphens and others characters
		//replacements = ['-','_',' '];
		code = code.replace(/[-_ ]/g, "");
		// Check for unwanted characters
		if (!is_numeric(code.substr(0,code.length-1)) && (!is_numeric(code.substr(-1) && code.substr(-1) != "X")))
		{
			this.setValid(false);
			this.addError(ERROR_INVALID_CHARACTERS);
		}
		return code;
	}
	/**
	 * Remove checksum character if present
	 */
	removeChecksum(code)
	{
		var length = code.length;
		if (length == 13 || length == 10)
		{
			code = code.substr(0,length-1);//code = substr_replace(code,"",-1);
			return code;
		}
		else if(length == 12 || length == 9)
		{
			return code;
		}
		else
		{
			this.setValid(false);
			this.addError(ERROR_INVALID_LENGTH);
			return code;
		}
	}
	/**
	 * Remove first three characters if 978 or 979 and save Product Code
	 */
	removeProductCode(code)
	{

		var first3 = code.substr(0,3);
		if (first3 == 978 || first3 == 979) {
			this.setProduct(first3);
			code = code.substr(3);
		} else {
			this.setProduct(978);
		}
		return code;
	}
	/**
	 * Remove and save Country Code
	 */
	removeCountryCode(code)
	{
		// Get the seven first digits
		var first7 = code.substr(0,7);
		var rules, ra, length;
		// Select the right set of rules according to the product code
		for(var z=0;z<this.getRanges().getPrefixes().length;z++)
		{
			if (this.getRanges().getPrefixes()[z]['Prefix'] == this.getProduct())
			{
				rules = this.getRanges().getPrefixes()[z]['Rules']['Rule'];

				break;
			}
		}
		// Select the right rule
		for(var z=0;z<rules.length;z++)
		{
			ra = rules[z]['Range'].split('-');
			if (first7 >= ra[0] && first7 <= ra[1])
			{
				length = rules[z]['Length'];
				break;
			}
		}

		this.setCountry(code.substr(0,length));
		code = code.substr(length);
		return code;
	}
	/**
	 * Remove and save Publisher Code and Publication Code
	 */
	removePublisherCode(code)
	{
		// Get the seven first digits
		var first7 = code.substr(0,7);
		var rules, ra, length;
		// Select the right set of rules according to the agency (product + country code)
		for(var z=0;z<this.getRanges().getGroups().length;z++)
		{
			if (this.getRanges().getGroups()[z]['Prefix'] != this.getProduct()+'-'+this.getCountry()) {
			    continue;
            }
            rules = this.getRanges().getGroups()[z]['Rules']['Rule'];
            this.setAgency(this.getRanges().getGroups()[z]['Agency']);
            // Select the right rule
            for(var y=0;y<rules.length;y++)
            {
                ra = rules[y]['Range'].split('-');
                if (first7 < ra[0] || first7 > ra[1]) {
                    continue;
                }
                length = rules[y]['Length'];
                this.setPublisher(code.substr(0,length));
                this.setPublication(code.substr(length));
                break;
            }
            break;
        }
	}
	/**
	 * Calculate checksum character
	 */
	calculateChecksum(format = 'EAN')
	{
		var sum = null;
		if (format == 'ISBN-10')
		{
			var code = this.getCountry()+this.getPublisher()+this.getPublication();
			var c = code.split("");
			sum = (11 - ((c[0] * 10) + (c[1] * 9) + (c[2] * 8) + (c[3] * 7) + (c[4] * 6) + (c[5] * 5) + (c[6] * 4) + (c[7] * 3) + (c[8] * 2)) % 11) % 11;
			if(sum == 10) sum = 'X';
		}
		else
		{
			code = this.getProduct()+this.getCountry()+this.getPublisher()+this.getPublication();
			var c = code.split('');
			for(var i=0; i<c.length; i++) { c[i] = +c[i]; }

			sum = ((c[1] + c[3] + c[5] + c[7] + c[9] + c[11]) * 3) + (c[0] + c[2] + c[4] + c[6] + c[8] + c[10]);
			sum = (10 - (sum % 10)) % 10;
		}
		this.setChecksum(sum);
	}
	/* SETTERS */
	setProduct(product)
	{
		this.product = product;
	}
	setCountry(country)
	{
		this.country = country;
	}
	setPublisher(publisher)
	{
		this.publisher = publisher;
	}
	setPublication(publication)
	{
		this.publication = publication;
	}
	setChecksum(checksum)
	{
		this.checksum = checksum;
	}
	setAgency(agency)
	{
		this.agency = agency;
	}
	/* GETTERS */
	getProduct()
	{
		return this.product;
	}
	getCountry()
	{
		return this.country;
	}
	getPublisher()
	{
		return this.publisher;
	}
	getPublication()
	{
		return this.publication;
	}
	getChecksum()
	{
		return this.checksum;
	}
	getAgency()
	{
		return this.agency;
	}
	getErrors()
	{
		errors = '['+this.input+']';

		for(var z=0;z<this.errors.length; z++)
		{
			errors += ' '+this.errors[z];
		}
		return errors;
	}
}

module.exports.Isbn = Isbn;





