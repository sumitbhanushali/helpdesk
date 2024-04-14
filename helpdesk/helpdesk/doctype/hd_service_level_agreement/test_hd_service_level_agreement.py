# Copyright (c) 2024, Frappe Technologies and Contributors
# See license.txt

import frappe
from frappe.tests.utils import FrappeTestCase
from helpdesk.helpdesk.doctype.hd_service_level_agreement.utils import get_sla

def get_create_obj():
	return {
		"service_level": "sla 1",
		"doctype": "HD Service Level Agreement",
		"enabled": 1,
		"default_sla": 1,
		"apply_sla_for_resolution": 1,
		"holiday_list": "Default",
		"priorities": [
        {
            "doctype": "HD Service Level Priority",
            "default_priority": 1,
            "parentfield": "priorities",
            "parenttype": "HD Service Level Agreement",
            "priority": "Low",
            "response_time": 14400,
            "resolution_time": 28800
        },
        {
            "doctype": "HD Service Level Priority",
            "default_priority": 0,
            "parentfield": "priorities",
            "parenttype": "HD Service Level Agreement",
            "priority": "Medium",
            "response_time": 7200,
            "resolution_time": 14400
        }
    ],
	"sla_fulfilled_on": [
        {
            "doctype": "HD Service Level Agreement Fulfilled On Status",
            "status": "Open",
            "parentfield": "sla_fulfilled_on",
            "parenttype": "HD Service Level Agreement",
        }
    ],
    "pause_sla_on": [
        {
            "doctype": "HD Pause Service Level Agreement On Status",
            "status": "Replied",
            "parentfield": "pause_sla_on",
            "parenttype": "HD Service Level Agreement",
        }
    ],
    "support_and_resolution": [
        {
            "doctype": "HD Service Day",
            "workday": "Monday",
            "parentfield": "support_and_resolution",
            "parenttype": "HD Service Level Agreement",
            "start_time": "09:00:00",
            "end_time": "17:00:00"
        },
        {
            "doctype": "HD Service Day",
            "workday": "Tuesday",
            "parentfield": "support_and_resolution",
            "parenttype": "HD Service Level Agreement",
            "start_time": "09:00:00",
            "end_time": "17:00:00"
        }
		],
	}
class TestHDServiceLevelAgreement(FrappeTestCase):
	def setUp(self):
		frappe.db.delete("HD Service Level Agreement")
	
	def test_sla_creation(self):
		sla = frappe.get_doc(get_create_obj()).insert()
		self.assertTrue(sla.name)

	def test_validate_priority(self):
		obj = get_create_obj()
		obj["priorities"] = None
		doc = frappe.get_doc(obj)
		with self.assertRaises(frappe.ValidationError, msg="Priorities are mandatory"):
			doc.insert()

		obj = get_create_obj()
		obj["priorities"][0]["default_priority"] = 0
		doc = frappe.get_doc(obj)
		with self.assertRaises(frappe.ValidationError, msg="There should be atleast one default priority"):
			doc.insert()

		obj = get_create_obj()
		obj["priorities"][1] = obj["priorities"][0]
		doc = frappe.get_doc(obj)
		with self.assertRaises(frappe.ValidationError, msg="There cannot be duplicate priorities"):
			doc.insert()

		obj = get_create_obj()
		obj["priorities"][0]["default_priority"] = 1
		obj["priorities"][1]["default_priority"] = 1
		doc = frappe.get_doc(obj)
		with self.assertRaises(frappe.ValidationError, msg="There can be only one priority as default"):
			doc.insert()

		obj = get_create_obj()
		obj["priorities"][0]["response_time"] = None
		doc = frappe.get_doc(obj)
		with self.assertRaises(frappe.ValidationError, msg="Response time is mandatory"):
			doc.insert()

		obj = get_create_obj()
		obj["priorities"][0]["resolution_time"] = None
		doc = frappe.get_doc(obj)
		with self.assertRaises(frappe.ValidationError, msg="Resolution time is mandatory when apply_sla_for_resolution is enabled"):
			doc.insert()

		obj = get_create_obj()
		obj["priorities"][0]["resolution_time"] = obj["priorities"][0]["response_time"] - 1
		doc = frappe.get_doc(obj)
		with self.assertRaises(frappe.ValidationError, msg="Resolution time cannot be less than response time"):
			doc.insert()
