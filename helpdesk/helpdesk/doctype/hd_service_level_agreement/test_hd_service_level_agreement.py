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
            "docstatus": 0,
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
            "docstatus": 0,
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

# default sla..test start and end time
# not default sla..test condition