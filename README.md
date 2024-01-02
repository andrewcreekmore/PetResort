# PetResort

Employee portal for a pet boarding & grooming business.  
Allows users to create and manage relevant business data.  
Full-stack web application built with Typescript, EJS, Bootstrap, Express, MongoDB, NodeJS.  

 Home | Dashboard | Visit Details | Admin
|------------|-------------|-------------|-------------|
| <img src="https://github.com/andrewcreekmore/PetResort/assets/44483269/e586063b-3da0-4721-a32a-e195217d4072" width="250"> | <img src="https://github.com/andrewcreekmore/PetResort/assets/44483269/39200933-6492-46f6-b874-e700237a7bd2" width="250"> | <img src="https://github.com/andrewcreekmore/PetResort/assets/44483269/b66efb59-95e3-48b2-8b52-26c970129114" width="250"> | <img src="https://github.com/andrewcreekmore/PetResort/assets/44483269/53e249c1-cb0f-4773-97d9-26e4ec27aba4" width="250"> |  

## Overview  
Features a dashboard overview (current/upcoming Visits, operations metadata), dedicated Guest (pet) and Client (customer/owner) CRUD views, and an Admin section with managed access: primary table views are readable by any user, but detail/edit views of models in this section require elevated user permissions. These models include Employees, Kennels, and cat/dog Services.

Features user authentication and authorization, including forgotten password reset functionality utilizing an emailed token. Utilizes both client and server-based validation for CRUD operations. Joi is used for schema validation.

## Usage
For demo usage, log in with `admin` as both your username and password.  
 [pet-resort.andrewcreekmore.com](https://pet-resort.andrewcreekmore.com)
