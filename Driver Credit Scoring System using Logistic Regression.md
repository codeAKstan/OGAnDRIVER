# **Driver Credit Scoring System using Logistic Regression**

## **Goal**

Build an AI system that automatically predicts a driver’s creditworthiness (Good or Bad) based on the personal, identification, and financial data they submit — including information extracted from their uploaded documents (e.g., bank statement, ID) — using Logistic Regression.

## **Output**

Probability of being creditworthy  
 Credit score (300–850)  
 Risk category (Excellent / Good / Fair / Poor)

## **Required Libraries**

import pandas as pd  
 import numpy as np  
 from datetime import datetime  
 from sklearn.model\_selection import train\_test\_split  
 from sklearn.linear\_model import LogisticRegression  
 from sklearn.preprocessing import LabelEncoder, StandardScaler  
 from sklearn.metrics import accuracy\_score, confusion\_matrix, classification\_report

## **Input Data (from Driver Registration Form)**

Personal Information: date\_of\_birth, gender, marital\_status, nationality  
 Contact Information: city, state  
 Identification & License: id\_type, years\_of\_experience  
 Additional Information: previous\_employment, criminal\_record, medical\_conditions  
 Financial Information: monthly\_income, bank\_statement\_upload  
 Target Column: creditworthy (1 \= Good, 0 \= Bad)

## **AI Document Parsing (OCR Integration)**

Use built-in OCR or Document AI to extract:  
 \- avg\_monthly\_balance  
 \- overdraft\_count  
 \- deposit\_consistency  
 \- id\_verified

## **Data Preprocessing**

Calculate age from date\_of\_birth  
 Encode categorical variables  
 Handle missing values  
 Normalize numeric columns  
 Split data into train/test sets

## **Model Training**

model \= LogisticRegression()  
 model.fit(X\_train, y\_train)

 Evaluate:  
 accuracy\_score(y\_test, y\_pred)  
 confusion\_matrix(y\_test, y\_pred)  
 classification\_report(y\_test, y\_pred)

## **Predict Creditworthiness**

prob \= model.predict\_proba(new\_driver\_data)\[0\]\[1\]  
 credit\_score \= int(300 \+ prob \* 550\)

 if credit\_score \>= 750:  
 	category \= 'Excellent'  
 elif credit\_score \>= 650:  
 	category \= 'Good'  
 elif credit\_score \>= 550:  
 	category \= 'Fair'  
 else:  
 	category \= 'Poor'

## **Workflow Summary**

1\. Driver submits form and uploads documents.  
 2\. OCR extracts key details.  
 3\. Data is preprocessed.  
 4\. Logistic Regression predicts creditworthiness.  
 5\. Display results.  
 6\. Store predictions in database.

## **Example Input**

{  
   'date\_of\_birth': '1990-03-10',  
   'gender': 'Male',  
   'marital\_status': 'Married',  
   'nationality': 'Nigerian',  
   'city': 'Enugu',  
   'state': 'Enugu',  
   'id\_type': 'National ID',  
   'years\_of\_experience': 6,  
   'previous\_employment': 'Yes',  
   'criminal\_record': 0,  
   'medical\_conditions': 0,  
   'monthly\_income': 140000,  
   'bank\_statement\_features': {  
   	'avg\_monthly\_balance': 95000,  
   	'overdraft\_count': 0,  
   	'deposit\_consistency': 1,  
   	'id\_verified': 1  
   }  
 }

## **Example Output**

Probability of Good Credit: 0.84  
 Predicted Credit Score: 767  
 Risk Category: Excellent (Low Risk)

## **Optional Enhancements**

Dashboard for driver credit stats  
 Automated email or SMS notifications  
 Periodic model retraining

