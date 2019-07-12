# -*- compile-command: make html -*-

.. figure:: Simba-NS.png
			:align: center

***************************
SIMBA Supply Logistics Demo
***************************

==========================

A simple demo shows how to use SIMBA API to post and get info to/from
a private blockchain (Circle of Life). An Ethereum account is auto
generated and Ethers are auto deposited, if no wallet is detected on
user's browser under this domain. This demo auto signs the transaction
with your Ethereum account when a post being made.

===========================

Live demo here: https://supplylogistics.simbachain.com/

*Watch this series of videos to get up to speed on using the SIMBA*
*Chain dashboard: (~15 minutes total)*

.. raw:: html

		 <iframe width="560" height="315"
		 src="https://www.youtube.com/embed/videoseries?list=PLgfX2jfDfJNMEqF_xjZBYmavONXeRK_q5"
		 frameborder="0" allow="accelerometer; autoplay;
		 encrypted-media; gyroscope; picture-in-picture"
		 allowfullscreen></iframe>


Requirements
============
* Node 10.16.0+ (https://nodejs.org/en/)
* (Optional) Azure Active Directory with Registered Accounts

Quick Installation
============
1. Clone the `Supply Logistics Demo Repository`_:
   ::
	  $ git clone https://github.com/SIMBAChain/SupplyLogisticsDemo


2. Install ``node`` requirements:
   ::
	  $ cd SupplyLogisticsDemo/
	  $ npm install

3. Obtain Simbachain API keys:

Before Starting make sure you have an account on the Simba Dashboard
and an Ethereum wallet with Ether in it on the Circle of life network

* Create The Smart Contract
* Create The Application
* Configure The Application(Ethereum Blockchain, Circle of Life, IPFS
  Filesystem, Permission disabled)
* Generate Application API Key(This is not the API name)
* Generate Configuration API Key

  ..figure:: Simba-NS.png

 .. note:: Both application an application API key and a configuration
           API key is needed. These keys are not interchangable.

4. Configure your application:

   Configuration parameters are set via environment variables. Inside
   ``src``, make a copy of the file ``.env.example`` and call it
   ``.env``.
   ::
	  $ cp src/.env.example src/.env

   Then replace the appropriate fields with keys obtained from step 3.

 .. note:: If you would like to include Microsoft Active Directory
           single sign-on, add your keys here, replacing
           ``yourClientID`` with the client ID for your application,
           and ``yourTenantID`` with the tenant ID for your
           application. Finally, change ``VUE_APP_ADAL_SSO`` to
           "``true``". If you haven't set this up already, see below
           for instructions on how to get up and running with
           Microsoft Active Directory.

5. Run the app locally:
   ::
	  $ npm run dev

   This will serve the app locally with hot reload at
   ``localhost:8080`` (if that port is available!)

Setting up Microsoft Azure Active Directory for Single Sign-On
============

1. Navigate to Azure Active Directory in the Azure Portal, and click
   on "App Registrations"

   .. figure:: 1.png

2. Enter a name for your app, choose the allowed account types, and
   set the redirect URI (this will be the base url that the app is
   deployed to for this demo).

   .. figure:: 2.png

3. Once the app is created, navigate to it, then click on
   Authentication. Tick both the Access tokens, and ID tokens box,
   then hit save.

   .. figure:: 3.png

4. Click on overview to get the Client ID, Tenant ID

   .. figure:: 4.png

.. _`Supply Logistics Demo Repository`:
   https://github.com/SIMBAChain/SupplyLogisticsDemo
