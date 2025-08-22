# Feature flag in User Profile Service

[[Tasks/Task: UPS. Beta features are not available for users with betaFeatures role#^7b708802-3c0b-11e9-9428-04d77e8d50cb/4cd5e700-b0fb-11ed-bc6d-77ea3b98be91]] 
* Feature flagging** is a software engineering technique that turns select functionality on and off without deploying new code.

——————————————————————————————————————————————

The main goal of managing feature flags:
* Make the process of releasing and testing new features easier. We expect that we will have to release on prod beta functionality that is not yet ready for production (release the functionality in parts).
* Also, we need to disable some broken features quickly in the production stage. 
* We want to be able to create new applications with different configurations of features.

The list of features is stored in **`user-profile-api`** DB in **`features`** table.

Short scheme of a part of DB.

![image.png](https://kontur.fibery.io/api/files/2ed863db-b59e-4876-a186-0ba8ca30d055#align=%3Aalignment%2Fblock-left&width=314&height=210 "")

Features are assigned to:
* applications (it means that feature is available by default for this application). 
  * configuration: each feature may have a specific configuration for an application. For example, we may have a different set of analytics for the feature "analytical_panel" for different applications. 
* users in the application (it means this user has access to all features within the application that are assigned to him). Usually, it contains more features than the default list. 

The features available to **unlogged** users for apps (it could be Disaster Ninja 2.0, Smart City, or other applications) are defined in the **app_feature** table.

The features available to unlogged users are available to **logged in** users by default. Some additional features may be available to **logged-in users** - they will be specified in **app_user_feature** table**.** 

### Feature select flow:

As for 2023-01-27

To be updated in [[Tasks/Task: UPS. Beta features are not available for users with betaFeatures role#^7b708802-3c0b-11e9-9428-04d77e8d50cb/4cd5e700-b0fb-11ed-bc6d-77ea3b98be91]] 

<https://drive.google.com/file/d/1yaCAUs40JA51fTavvXUaC9W2nfafO-Q0/view?usp=sharing> 

![image.png](https://kontur.fibery.io/api/files/d69e379f-2425-4f8a-844d-25e2dd2a4678#width=1141&height=1147 "")

### **Features properties:**

|     |     |
| --- | --- |
| **Property** | **Meaning** |
| **name** | Humane readable feature name |
| **beta** boolean (true/false) | true - feature is available if it's assigned to an application or user via application and user has a dedicated role "**betaFeatures**" (more information is here [[Tasks/document: How to add beta features for Kontur platform users#^b2d59af0-3b70-11e9-be77-04d77e8d50cb/20d0a0f0-bfa7-11ec-9620-ed9998ad9123]]) false - feature is available if it's assigned to an application or user via application without additional conditions  **Beta feature** is a way to test new features on the system before they are released to everyone. |
| **featuretype** | Type of features: UI_PANEL EVENT_FEED (Event feed, which could be the default for the app or user.  To set up a default feed for an application or a user add the feed:  - to the **app_features** table for the application - to the **app_user_feature** table for the user) LAYER (not used now 2023-01-26) BIVARIATE_LAYER (not used now 2023-01-26) BIVARIATE_PRESET (not used now 2023-01-26) MAP_MODE (not used now 2023-01-26) (will be added according to the task [[Tasks/Task: Update user-profile API to add active modes settings for embedded maps #^7b708802-3c0b-11e9-9428-04d77e8d50cb/b17b8c80-ab45-11ec-8044-253769e71b28]] ) |
| **enabled** boolean (true/false) | true - feature is available for all users, who have access to this feature false - feature is not available for any users for all apps Can be used to turn off a feature quickly. |
| **description** | A short description of a feature (for internal use). |
| **available_for_user_apps** boolean (true/false) | true - feature **is available** to the user to add it to the embedded map false - feature **is not available** to the user to add it to the embedded map |
| **default_for_user_apps** boolean (true/false) | true - features that are **automatically** added to embedded maps when maps are created (available and required for embedded map) false - features that are not automatically added to embedded maps when maps are created |

