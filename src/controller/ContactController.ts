import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { Contact } from "../entity/Contact";
import { ContactUtils } from "../utils";

export class ContactController {
  private contactRepository = AppDataSource.getRepository(Contact);
  private utilRepository = new ContactUtils(this.contactRepository);

  async identify(request: Request, response: Response, next: NextFunction) {
    const { email, phoneNumber } = request.body;

    const contactByEmail = email ? await this.contactRepository.findOne({
      where: { email },
    }) : null;
    const contactByPhone = phoneNumber ? await this.contactRepository.findOne({
      where: { phoneNumber },
    }) : null;

    if (contactByEmail && contactByPhone) {
      if (contactByEmail.id === contactByPhone.id) {
        response.json(await this.utilRepository.getIdentifyResponse(contactByEmail));
      } else {
        if (
          contactByEmail.linkPrecedence === "primary" &&
          contactByPhone.linkPrecedence === "primary"
        ) {
          // updated newest contact's linkedPrecendence to secondary and linkedId as oldest contact id
          const primaryContact =
            contactByEmail.createdAt < contactByPhone.createdAt
              ? contactByEmail
              : contactByPhone;
          const secondaryContact =
            contactByEmail.createdAt < contactByPhone.createdAt
              ? contactByPhone
              : contactByEmail;
          secondaryContact.linkPrecedence = "secondary";
          secondaryContact.linkedId = primaryContact.id;
          await this.contactRepository.save(secondaryContact);

          response.json(await this.utilRepository.getIdentifyResponse(primaryContact));
        } else if (contactByEmail.linkPrecedence === "primary") {
          const secondaryContact = contactByPhone;
          secondaryContact.linkedId = contactByEmail.id;
          await this.contactRepository.save(secondaryContact);

          response.json(await this.utilRepository.getIdentifyResponse(contactByEmail));
        } else {
          const secondaryContact = contactByEmail;
          secondaryContact.linkedId = contactByPhone.id;
          await this.contactRepository.save(secondaryContact);

          response.json(await this.utilRepository.getIdentifyResponse(contactByPhone));
        }
      }
    } else {
      if (!contactByEmail && !contactByPhone) {
        // create a new primary contact with email and phoneNumber
        const newContact = Object.assign(new Contact(), {
          email,
          phoneNumber,
          linkPrecedence: "primary",
        });
        await this.contactRepository.save(newContact);

        response.json({
          contact: {
            primaryContactId: newContact.id,
            emails: [newContact.email],
            phoneNumbers: [newContact.phoneNumber],
            secondaryContactIds: [],
          },
        });
      } else if (!contactByEmail) {
        if (contactByPhone.linkPrecedence === "primary") {
          // create a new secondary contact with email attach it to contactByPhone
          if (email && contactByPhone.email != email) {
            const secondaryContact = Object.assign(new Contact(), {
              email,
              phoneNumber,
              linkPrecedence: "secondary",
              linkedId: contactByPhone.id,
            });
            await this.contactRepository.save(secondaryContact);
          }

          response.json(await this.utilRepository.getIdentifyResponse(contactByPhone));
        } else {
          // create a new secondary contact with email attach it to contactByPhone'primary id
          if (email && contactByPhone.email != email) {
            const secondaryContact = Object.assign(new Contact(), {
              email,
              phoneNumber,
              linkPrecedence: "secondary",
              linkedId: contactByPhone.linkedId,
            });
            await this.contactRepository.save(secondaryContact);
          }

          response.json(await this.utilRepository.getIdentifyResponse(contactByPhone, "linkedId"));
        }
      } else {
        if (contactByEmail.linkPrecedence === "primary") {
          // create a new secondary contact with phone attach it to contactByEmail
          if (phoneNumber && contactByEmail.phoneNumber !== phoneNumber) {
            const secondaryContact = Object.assign(new Contact(), {
              email,
              phoneNumber,
              linkPrecedence: "secondary",
              linkedId: contactByEmail.id,
            });
            await this.contactRepository.save(secondaryContact);
          }

          response.json(await this.utilRepository.getIdentifyResponse(contactByEmail));
        } else {
          // create a new secondary contact with phone attach it to contactByEmail'primary id
          if (phoneNumber && contactByEmail.phoneNumber !== phoneNumber) {
            const secondaryContact = Object.assign(new Contact(), {
              email,
              phoneNumber,
              linkPrecedence: "secondary",
              linkedId: contactByEmail.linkedId,
            });
            await this.contactRepository.save(secondaryContact);
          }

          response.json(await this.utilRepository.getIdentifyResponse(contactByEmail, "linkedId"));
        }
      }
    }
  }
}
