# Copyright (c) 2023, Frappe Technologies and Contributors
# See license.txt

import frappe
from frappe.tests.utils import FrappeTestCase

from helpdesk.consts import DEFAULT_TICKET_PRIORITY

def get_ticket_obj():
	return {
		"doctype": "HD Ticket",
		"subject": "Test Ticket",
		"description": "Test Ticket Description"
	}
class TestHDTicket(FrappeTestCase):
	def setUp(self):
		frappe.db.delete("HD Ticket")

	def test_ticket_creation(self):
		ticket = frappe.get_doc(get_ticket_obj())
		ticket.insert()
		self.assertTrue(ticket.name)

	def test_mandatory_ticket_fields(self):
		doc = frappe.get_doc({"doctype": "HD Ticket"})
		with self.assertRaisesRegex(frappe.MandatoryError, "subject, description", msg="Subject and description should be mandatory fields"):
			doc.insert()
	
	def test_ticket_default_status(self):
		ticket = frappe.get_doc(get_ticket_obj())
		ticket.insert()
		self.assertEqual(ticket.status, "Open")
	
	def test_ticket_default_priority(self):
		ticket = frappe.get_doc(get_ticket_obj()).insert()
		self.assertEqual(ticket.priority, DEFAULT_TICKET_PRIORITY, 
				   msg="default Ticket Priority should be set to DEFAULT_TICKET_PRIORITY when Default Priority is not set in HD Settings")


		hd_settings = frappe.get_doc("HD Settings")
		hd_settings.default_priority = "Low"
		hd_settings.save()

		ticket = frappe.get_doc(get_ticket_obj()).insert()
		self.assertEqual(ticket.priority, "Low", 
				   msg="default Ticket Priority should be set from Default Priority in HD Settings")
		
	def test_ticket_default_type(self):
		ticket = frappe.get_doc(get_ticket_obj()).insert()
		self.assertEqual(ticket.ticket_type, "Unspecified", 
				   msg="default Ticket Type should be set to DEFAULT_TICKET_TYPE when Default Type is not set in HD Settings")

		hd_settings = frappe.get_doc("HD Settings")
		hd_settings.default_ticket_type = "Incident"
		hd_settings.save()

		ticket = frappe.get_doc(get_ticket_obj()).insert()
		self.assertEqual(ticket.ticket_type, "Incident", 
				   msg="default Ticket Type should be set from Default Type in HD Settings")
		
	def test_ticket_default_sla_track_sla(self):
		ticket = frappe.get_doc(get_ticket_obj()).insert()
		self.assertEqual(ticket.sla, "Default", 
				   msg="Ticket SLA should be set to SLA with Default SLA and Track SLA checked")
		
	def test_ticket_default_sla_without_track_sla(self):
		hd_settings = frappe.get_doc("HD Settings")
		hd_settings.track_service_level_agreement = 0
		hd_settings.save()

		ticket = frappe.get_doc(get_ticket_obj()).insert()
		self.assertEqual(ticket.sla, None, 
				   msg="Ticket SLA should not be set to SLA when Track SLA unchecked")