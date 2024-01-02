# PetResort

Employee portal for a pet boarding & grooming business.  
Allows users to create and manage relevant business data.
Full-stack web application built with Typescript, EJS, Bootstrap, Express, MongoDB, NodeJS.  

## Overview  
Features a dashboard quick-info view for current operations, dedicated Guest (pet) and Client (customer/owner) CRUD views, and an Admin section with managed access: primary table views are readable by any user, but detail/edit views of models in this section require elevated user permissions. These models include Employees, Kennels, and cat/dog Services.

Features user authentication and authorization, including forgotten password reset functionality utilizing an emailed token. 

Features both client and server-based validation for CRUD operations. Joi is used for schema validation.

## Usage
For demo usage, log in with `admin` as both your username and password.
 [pet-resort.andrewcreekmore.com](https://pet-resort.andrewcreekmore.com)