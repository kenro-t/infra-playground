resource "aws_instance" "example" {
  ami                    = "ami-0404778e217f54308"
  instance_type          = "t3.micro"
  subnet_id              = aws_subnet.public.id
  vpc_security_group_ids = [aws_security_group.example.id]
  tags = {
    Name = "example-instance"
  }
}
