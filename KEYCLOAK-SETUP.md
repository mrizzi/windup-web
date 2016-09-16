# Manual steps to install Keycloak (or Red Hat SSO) on development server

> Note: (not recommended for a production usage)

## A) Keycloack installation

* Download https://downloads.jboss.org/keycloak/2.1.0.Final/keycloak-overlay-2.1.0.Final.tar.gz

* Extract it into wildfly-10.1.0.Final installation path

* Edit

 `<$path_to_widlfly_server>/bin/keycloak-install.cli` and change `standalone.xml` to `standalone-full.xml` on first line

* Start the server with full profile as:

	`bin/standalone.sh -c standalone-full.xml`

* Run  `<path_to_widlfly_server>/bin/jboss-cli.sh --file=bin/keycloak-install.cli`
* Restart the server
* To create keycloak Admin user run  `<path_to_widlfly_server>/bin/add-user-keycloack.sh -u <username>`

	This command creates file below with your username:
	`<path_to_widlfly_server>/standalone/configuration/keycloak-add-user.json`
	(This is an alternative to do it manually at http://localhost/auth/admin)

* Restart the server.
* After restart check <http://localhost:8080/auth> if keycloak login page is shown you can use keycloak admin user you created in previous steps.


## B) Red Hat SSO installation

SSO Instructions:
https://access.redhat.com/documentation/en/red-hat-single-sign-on/7.0/single/getting-started-guide/#installing_distribution_files

 - Download and setup SSO 7.0
	- Startup with offset 200 to avoid conflicts with your local EAP and arquillian instances:
		- `./standalone.sh -Djboss.socket.binding.port-offset=200`
	- Navigate to setup console:
		- [http://localhost:8280/auth/](http://localhost:8280/auth/)
			- Setup an admin user and password here
	- Navigate to Keycloak admin:
		- http://localhost:8280/auth/admin/
		- Login with the username that was just created
	- Setup a new realm called "windup"
	- Create a new Role called "user"
	- Add this new role to the "Default Roles"
	- Create a new user for this realm



 - Install the EAP 7 Adapter into the EAP instance that will run Windup Web
	- Download the RH-SSO-7.0.0-eap7-adapter.zip and unzip it into the root directory of your EAP 7 installation
	- Run the installer: 
		- `cd bin`
		- Modify `adapter-install-offline.cli` to point to `standalone-full.xml` (instead of `standalone.xml`)
		- `./jboss-cli.sh --file=adapter-install-offline.cli`

##  Register the client in Keycloak for windup-web
	- Go back to the Keycloak admin console [http://localhost:8280/auth/admin/](http://localhost:8280/auth/admin/)
	- Click clients in the left
	- Click "Create"
		- Client ID: "windup-web"
		- Root URL: [http://localhost:8080/windup-web/](http://localhost:8080/windup-web/)
		- Click "Save"
    - On the settings page, make sure that both of the following URLs are listed as Valid Redirect URIs (add the one that is missing):
        - http://localhost:8080/windup-web-services/*
        - http://localhost:8080/windup-web/*
	- Click on the "Installation" tab, and select the "Keycloak OIDC JBoss Subsystem XML" format option
	- With the server off, open up standalone-full.xml and paste this text into the "urn:jboss:domain:keycloak:1.1" subsystem element
	- Change the "WAR MODULE NAME.war" section to the war name (windup-web.war)
    - Add the following system properties being sure to replace the key with the one from the copied section:

        ```
        <system-properties>
            <property name="keycloak.realm.public.key" value="[ INSERT KEY HERE ]"/>
            <property name="keycloak.server.url" value="http://localhost:8280/auth"/>
        </system-properties>
        ```
    - Replace the realm-public-key and auth-server-url elements in the extension configuration with the following text:
    
        ```
            <realm-public-key>${keycloak.realm.public.key}</realm-public-key>
            <auth-server-url>${keycloak.server.url}</auth-server-url>
        ```

 - Register the client in Keycloak for windup-web-services
	- Follow the same steps, except use the name "windup-web-services" instead of "windup-web"

