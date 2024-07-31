import { ApiProperty } from "@nestjs/swagger";

export class MemberBookDto {

    @ApiProperty({
        description: "The code for the member",
        example: "M001"
    })
    memberCode: string;

    @ApiProperty({
        description: "The code for the book",
        example: "JK-45"
    })
    bookCode: string;
}